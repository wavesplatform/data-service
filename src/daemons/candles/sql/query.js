const knex = require('knex');
const pg = knex({ client: 'pg' });

const { CandleInterval } = require('../../../types');

const {
  pgRawDateTrunc,
  makeRawTimestamp,
  serializeCandle,
  candlePresets,
} = require('./utils');

/** makeCandleCalculateColumns :: String -> Array */
const makeCandleCalculateColumns = interval => {
  return {
    candle_time: candlePresets.aggregate.candle_time(interval),
    amount_asset_uid: 'amount_asset_uid',
    price_asset_uid: 'price_asset_uid',
    low: candlePresets.aggregate.low,
    high: candlePresets.aggregate.high,
    volume: candlePresets.aggregate.volume,
    quote_volume: candlePresets.aggregate.quote_volume,
    max_height: candlePresets.aggregate.max_height,
    txs_count: candlePresets.aggregate.txs_count,
    weighted_average_price: candlePresets.aggregate.weighted_average_price,
    open: candlePresets.aggregate.open,
    close: candlePresets.aggregate.close,
    interval: pg.raw(`'${interval}'`),
    matcher_address_uid: 'matcher_address_uid',
  };
};

const candleSelectColumns = {
  time_start: 'e.candle_time',
  amount_asset_uid: 'amount_asset_uid',
  price_asset_uid: 'price_asset_uid',
  low: pg.min('e.price'),
  high: pg.max('e.price'),
  volume: pg.sum('e.amount'),
  quote_volume: pg.raw('sum(e.amount * e.price)'),
  max_height: pg.max('height'),
  txs_count: pg.count('e.price'),
  weighted_average_price: pg.raw(
    'sum((e.amount)::numeric * (e.price)::numeric)/sum((e.amount)::numeric)'
  ),
  open: pg.raw('(array_agg(e.price ORDER BY e.candle_time)::numeric[])[1]'),
  close: pg.raw(
    '(array_agg(e.price ORDER BY e.candle_time DESC)::numeric[])[1]'
  ),
  interval: pg.raw(`'${CandleInterval.Minute1}'`),
  matcher_address_uid: 'e.sender_uid',
};

/** insertIntoCandlesFromSelect :: (String, Function) -> QueryBuilder */
const insertIntoCandlesFromSelect = (tableName, selectFunction) =>
  pg.into(tableName).insert(selectFunction);

/** selectExchanges :: QueryBuilder */
const selectExchanges = pg({
  t: pg({ t: 'txs_7' }).select({
    tx_uid: 't.tx_uid',
    amount_asset_uid: pg.raw('coalesce(t.amount_asset_uid, 0)'),
    price_asset_uid: pg.raw('coalesce(t.price_asset_uid, 0)'),
    sender_uid: 't.sender_uid',
    height: 't.height',
    candle_time: pgRawDateTrunc('t.time_stamp')('minute'),
    amount: 't.amount',
    price: 't.price',
  }),
})
  .select({
    tx_uid: 't.tx_uid',
    amount_asset_uid: 't.amount_asset_uid',
    price_asset_uid: 't.price_asset_uid',
    sender_uid: 't.sender_uid',
    height: 't.height',
    candle_time: 't.candle_time',
    amount: pg.raw('t.amount * 10 ^(-a.decimals)'),
    price: pg.raw('t.price * 10 ^(-8 - p.decimals + a.decimals)'),
  })
  .join({ a: 'assets_data' }, 'a.uid', 't.amount_asset_uid')
  .join({ p: 'assets_data' }, 'p.uid', 't.price_asset_uid');

/** selectExchangesAfterTimestamp :: Date -> QueryBuilder */
const selectExchangesAfterTimestamp = fromTimestamp =>
  selectExchanges.clone().where(
    't.tx_uid',
    '>=',
    pg('txs')
      .select('uid')
      .from('txs')
      .whereRaw(
        `time_stamp >= ${pgRawDateTrunc(
          `'${fromTimestamp.toISOString()}'::timestamp`
        )('minute')}`
      )
      .limit(1)
  );

/** selectLastCandle :: String -> String query */
const selectLastCandleHeight = tableName =>
  pg({ t: tableName })
    .select('max_height')
    .limit(1)
    .orderBy('max_height', 'desc')
    .toString();

/** selectLastExchangeTx :: String query */
const selectLastExchangeTxHeight = () =>
  pg({ t: 'txs_7' })
    .select('height')
    .limit(1)
    .orderBy('height', 'desc')
    .toString();

/** selectLastExchangeTx :: String query */
const selectMinTimestampFromHeight = height =>
  pg({
    t: pg('txs_7')
      .column('time_stamp')
      .where('height', '>=', height)
      .orderBy('tx_uid')
      .limit(1),
  })
    .column({ time_stamp: pg.min('t.time_stamp') })
    .toString();

/** for make complex query with "on conflict (...) update ... without set concrete values" See insertOrUpdateCandles or insertOrUpdateCandlesFromShortInterval */
const updatedFieldsExcluded = [
  'open',
  'close',
  'low',
  'high',
  'max_height',
  'quote_volume',
  'txs_count',
  'volume',
  'weighted_average_price',
]
  .map(field => field + '=EXCLUDED.' + field)
  .join(', ');

/** insertOrUpdateCandles :: (String, Array[Object]) -> String query */
const insertOrUpdateCandles = (tableName, candles) => {
  if (candles.length) {
    return pg
      .raw(
        `${pg({ t: tableName }).insert(
          candles.map(serializeCandle)
        )} on conflict (time_start, amount_asset_uid, price_asset_uid, matcher_address_uid, interval) do update set ${updatedFieldsExcluded}`
      )
      .toString();
  }

  return ';';
};

/** insertOrUpdateCandlesFromShortInterval :: (String, Date, Number, Number) -> String query */
const insertOrUpdateCandlesFromShortInterval = (
  tableName,
  fromTimestamp,
  shortInterval,
  longerInterval
) =>
  pg
    .raw(
      `${insertIntoCandlesFromSelect(tableName, function() {
        this.from(tableName)
          .select(makeCandleCalculateColumns(longerInterval))
          .where('interval', shortInterval)
          .whereRaw(
            pg.raw(
              `time_start >= ${makeRawTimestamp(fromTimestamp, longerInterval)}`
            )
          )
          .groupBy(
            'candle_time',
            'amount_asset_uid',
            'price_asset_uid',
            'matcher_address_uid'
          );
      })} on conflict (time_start, amount_asset_uid, price_asset_uid, matcher_address_uid, interval) do update set ${updatedFieldsExcluded}`
    )
    .toString();

/**
 * SET statement_timeout = 0
 * @returns string
 */
const withoutStatementTimeout = () =>
  pg.raw('SET statement_timeout = 0').toString();

/** truncateTable :: String -> String query */
const truncateTable = tableName =>
  pg(tableName)
    .truncate()
    .toString();

/** insertAllMinuteCandles :: String -> String query */
const insertAllMinuteCandles = tableName =>
  insertIntoCandlesFromSelect(tableName, function() {
    this.with('e_cte', selectExchanges)
      .select(candleSelectColumns)
      .from({ e: 'e_cte' })
      .groupByRaw(
        'e.candle_time, e.amount_asset_uid, e.price_asset_uid, e.sender_uid'
      );
  }).toString();

/** insertAllCandles :: (String, Number, Number, Number) -> String query */
const insertAllCandles = (tableName, shortInterval, longerInterval) =>
  insertIntoCandlesFromSelect(tableName, function() {
    this.from({ t: tableName })
      .column(makeCandleCalculateColumns(longerInterval))
      .where('t.interval', shortInterval)
      .groupBy([
        'candle_time',
        'amount_asset_uid',
        'price_asset_uid',
        'matcher_address_uid',
      ]);
  }).toString();

/** selectCandlesAfterTimestamp :: Date -> String query */
const selectCandlesAfterTimestamp = timetamp =>
  pg
    .columns(candleSelectColumns)
    .from(
      selectExchangesAfterTimestamp(timetamp)
        .clone()
        .as('e')
    )
    .groupBy([
      'e.candle_time',
      'e.amount_asset_uid',
      'e.price_asset_uid',
      'e.sender_uid',
    ])
    .toString();

module.exports = {
  withoutStatementTimeout,
  truncateTable,
  insertAllMinuteCandles,
  insertAllCandles,
  selectCandlesAfterTimestamp,
  insertOrUpdateCandles,
  selectLastCandleHeight,
  selectLastExchangeTxHeight,
  insertOrUpdateCandlesFromShortInterval,
  selectMinTimestampFromHeight,
};
