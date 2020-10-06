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
const makeCandleCalculateColumns = (interval) => {
  return {
    candle_time: candlePresets.aggregate.candle_time(interval),
    amount_asset_id: 'amount_asset_id',
    price_asset_id: 'price_asset_id',
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
    matcher_address: 'matcher_address',
  };
};

const candleSelectColumns = {
  time_start: 'e.candle_time',
  amount_asset_id: 'amount_asset_id',
  price_asset_id: 'price_asset_id',
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
  matcher_address: 'e.sender',
};

/** insertIntoCandlesFromSelect :: (String, Function) -> QueryBuilder */
const insertIntoCandlesFromSelect = (candlesTableName, selectFunction) =>
  pg.into(candlesTableName).insert(selectFunction);

/** selectExchanges :: QueryBuilder */
const selectExchanges = pg({ t: 'txs_7' }).select({
  tx_uid: 't.tx_uid',
  amount_asset_id: 't.amount_asset_id',
  price_asset_id: 't.price_asset_id',
  sender: 't.sender',
  height: 't.height',
  candle_time: pgRawDateTrunc('t.time_stamp')('minute'),
  amount: 't.amount',
  price: 't.price',
});

/** selectExchangesAfterTimestamp :: Date -> QueryBuilder */
const selectExchangesAfterTimestamp = (fromTimestamp) =>
  selectExchanges.clone().where(
    't.tx_uid',
    '>=',
    pg('txs')
      .select('uid')
      .whereRaw(
        `time_stamp >= ${pgRawDateTrunc(
          `'${fromTimestamp.toISOString()}'::timestamp`
        )('minute')}`
      )
      .limit(1)
  );

/** selectLastCandle :: String -> String query */
const selectLastCandleHeight = (candlesTableName) =>
  pg({ t: candlesTableName })
    .select('max_height')
    .limit(1)
    .orderBy('max_height', 'desc')
    .toString();

/** selectLastExchangeTx :: String query */
const selectLastExchangeTxHeight = () =>
  pg({ t: 'txs_7' })
    .select('height')
    .limit(1)
    .orderBy('tx_uid', 'desc')
    .toString();

/** selectLastExchangeTx :: String query */
const selectMinTimestampFromHeight = (height) =>
  pg('txs_7')
    .column('time_stamp')
    .where('height', '>=', height)
    .orderBy('tx_uid')
    .limit(1)
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
  .map((field) => field + '=EXCLUDED.' + field)
  .join(', ');

/** insertOrUpdateCandles :: (String, Array[Object]) -> String query */
const insertOrUpdateCandles = (candlesTableName, candles) => {
  if (candles.length) {
    return pg
      .raw(
        `${pg({ t: candlesTableName }).insert(
          candles.map(serializeCandle)
        )} on conflict (time_start, amount_asset_id, price_asset_id, matcher_address, interval) do update set ${updatedFieldsExcluded}`
      )
      .toString();
  }

  return ';';
};

/** insertOrUpdateCandlesFromShortInterval :: (String, Date, Number, Number) -> String query */
const insertOrUpdateCandlesFromShortInterval = (
  candlesTableName,
  fromTimestamp,
  shortInterval,
  longerInterval
) =>
  pg
    .raw(
      `${insertIntoCandlesFromSelect(candlesTableName, function () {
        this.from(candlesTableName)
          .select(makeCandleCalculateColumns(longerInterval))
          .where('interval', shortInterval)
          .whereRaw(
            pg.raw(
              `time_start >= ${makeRawTimestamp(fromTimestamp, longerInterval)}`
            )
          )
          .groupBy(
            'candle_time',
            'amount_asset_id',
            'price_asset_id',
            'matcher_address'
          );
      })} on conflict (time_start, amount_asset_id, price_asset_id, matcher_address, interval) do update set ${updatedFieldsExcluded}`
    )
    .toString();

/**
 * SET statement_timeout = 0
 * @returns string
 */
const withoutStatementTimeout = () =>
  pg.raw('SET statement_timeout = 0').toString();

/** truncateTable :: String -> String query */
const truncateTable = (candlesTableName) =>
  pg(candlesTableName).truncate().toString();

/** insertAllMinuteCandles :: String -> String query */
const insertAllMinuteCandles = (candlesTableName) =>
  insertIntoCandlesFromSelect(candlesTableName, function () {
    this.with('e_cte', selectExchanges)
      .select(candleSelectColumns)
      .from({ e: 'e_cte' })
      .groupByRaw(
        'e.candle_time, e.amount_asset_id, e.price_asset_id, e.sender'
      );
  }).toString();

/** insertAllCandles :: (String, Number, Number, Number) -> String query */
const insertAllCandles = (candlesTableName, shortInterval, longerInterval) =>
  insertIntoCandlesFromSelect(candlesTableName, function () {
    this.from({ t: candlesTableName })
      .column(makeCandleCalculateColumns(longerInterval))
      .where('t.interval', shortInterval)
      .groupBy([
        'candle_time',
        'amount_asset_id',
        'price_asset_id',
        'matcher_address',
      ]);
  }).toString();

/** selectCandlesAfterTimestamp :: Date -> String query */
const selectCandlesAfterTimestamp = (timetamp) =>
  pg
    .columns(candleSelectColumns)
    .from(selectExchangesAfterTimestamp(timetamp).clone().as('e'))
    .groupBy([
      'e.candle_time',
      'e.amount_asset_id',
      'e.price_asset_id',
      'e.sender',
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
