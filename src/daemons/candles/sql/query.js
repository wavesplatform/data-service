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
    matcher_address_uid: 'matcher_address_uid',
  };
};

const candleSelectColumns = [
  { time_start: 'e.candle_time' },
  'amount_asset_uid',
  'price_asset_uid',
  { low: pg.raw('min(e.price * 10 ^(-8 - p.decimals + a.decimals))') },
  { high: pg.raw('max(e.price * 10 ^(-8 - p.decimals + a.decimals))') },
  { volume: pg.raw('sum(e.amount * 10 ^(-a.decimals))') },
  {
    quote_volume: pg.raw(
      'sum(e.amount * 10 ^(-a.decimals) * e.price * 10 ^(-8 - p.decimals + a.decimals))'
    ),
  },
  { max_height: pg.max('height') },
  { txs_count: pg.raw('count(e.price)') },
  {
    weighted_average_price: pg.raw(
      'sum((e.amount * 10 ^(-a.decimals))::numeric * (e.price * 10 ^(-8 - p.decimals + a.decimals))::numeric)/sum((e.amount * 10 ^(-a.decimals))::numeric)'
    ),
  },
  {
    open: pg.raw(
      '(array_agg(e.price * 10 ^(-8 - p.decimals + a.decimals) ORDER BY e.candle_time)::numeric[])[1]'
    ),
  },
  {
    close: pg.raw(
      '(array_agg(e.price * 10 ^(-8 - p.decimals + a.decimals) ORDER BY e.candle_time DESC)::numeric[])[1]'
    ),
  },
  {
    interval: pg.raw(`'${CandleInterval.Minute1}'`),
  },
  { matcher_address_uid: 'sender_uid' },
];

/** insertIntoCandlesFromSelect :: (String, Function) -> QueryBuilder */
const insertIntoCandlesFromSelect = (tableName, selectFunction) =>
  pg.into(tableName).insert(selectFunction);

/** selectExchanges :: QueryBuilder */
const selectExchanges = pg({ t: 'txs_7' })
  .column(
    'o.amount_asset_uid',
    'o.price_asset_uid',
    't.sender_uid',
    't.height',
    { candle_time: pgRawDateTrunc('txs.time_stamp')('minute') },
    `t.amount`,
    `t.price`
  )
  .join({ txs: 'txs' }, 'txs.uid', 't.tx_uid')
  .join({ o: 'txs_7_orders' }, 'o.order_uid', 't.order1_uid');

/** selectExchangesAfterTimestamp :: Date -> QueryBuilder */
const selectExchangesAfterTimestamp = fromTimestamp =>
  selectExchanges.clone().where(
    't.tx_uid',
    '>=',
    pg('txs')
      .select('uid')
      .from('txs')
      .whereRaw(
        `t.time_stamp >= ${pgRawDateTrunc(
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
    t: pg('txs')
      .column('time_stamp')
      .where('tx_type', 7)
      .andWhere('height', '>=', height)
      .orderBy('uid')
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

/** truncateTable :: String -> String query */
const truncateTable = tableName =>
  pg(tableName)
    .truncate()
    .toString();

/** insertAllMinuteCandles :: String -> String query */
const insertAllMinuteCandles = tableName =>
  insertIntoCandlesFromSelect(tableName, function() {
    this.select(candleSelectColumns)
      .from(selectExchanges.clone().as('e'))
      .innerJoin({ a: 'assets' }, 'e.amount_asset_uid', 'a.uid')
      .innerJoin({ p: 'assets' }, 'e.price_asset_uid', 'p.uid')
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
    .innerJoin({ a: 'assets' }, 'e.amount_asset_uid', 'a.uid')
    .innerJoin({ p: 'assets' }, 'e.price_asset_uid', 'p.uid')
    .groupBy([
      'e.candle_time',
      'e.amount_asset_uid',
      'e.price_asset_uid',
      'e.sender_uid',
    ])
    .toString();

module.exports = {
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
