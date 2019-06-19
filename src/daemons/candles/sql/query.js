const knex = require('knex');
const pg = knex({ client: 'pg' });

const { serializeCandle, candlePresets } = require('./utils');

/** makeCandleCalculateColumns :: Number -> Array */
const makeCandleCalculateColumns = longerInterval => {
  return {
    candle_time: candlePresets.aggregate.candle_time(longerInterval),
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
    interval_in_secs: longerInterval,
    matcher: 'matcher',
  };
};

const candleSelectColumns = [
  {
    time_start: pg.raw('e.candle_time'),
  },
  'amount_asset as amount_asset_id',
  'price_asset as price_asset_id',
  {
    low: pg.raw('min(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))'),
  },
  {
    high: pg.raw('max(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))'),
  },
  {
    volume: pg.raw('sum(e.amount * 10 ^(-a_dec.decimals))'),
  },
  {
    quote_volume: pg.raw(
      'sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))'
    ),
  },
  {
    max_height: pg.max('height'),
  },
  {
    txs_count: pg.raw('count(e.price)'),
  },
  {
    weighted_average_price: pg.raw(
      'sum((e.amount * 10 ^(-a_dec.decimals))::numeric * (e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))::numeric)/sum((e.amount * 10 ^(-a_dec.decimals))::numeric)'
    ),
  },
  {
    open: pg.raw(
      '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals) ORDER BY e.candle_time)::numeric[])[1]'
    ),
  },
  {
    close: pg.raw(
      '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals) ORDER BY e.candle_time DESC)::numeric[])[1]'
    ),
  },
  {
    interval_in_secs: 60,
  },
  'sender as matcher',
];

/** insertIntoCandlesFromSelect :: (String, Function) -> QueryBuilder */
const insertIntoCandlesFromSelect = (tableName, selectFunction) =>
  pg.into(tableName).insert(selectFunction);

/** selectExchanges :: QueryBuilder */
const selectExchanges = pg({ t: 'txs_7' }).column(
  'amount_asset',
  'price_asset',
  'sender',
  'height',
  { candle_time: pg.raw(`date_trunc('minute', t.time_stamp)`) },
  `amount`,
  `price`,
);

/** selectExchangesAfterTimestamp :: Date -> QueryBuilder */
const selectExchangesAfterTimestamp = fromTimestamp =>
  selectExchanges
    .clone()
    .whereRaw(
      `t.time_stamp >= date_trunc('minute', '${fromTimestamp.toISOString()}'::timestamp)`
    );

/** selectLastCandle :: String -> String query */
const selectLastCandle = tableName =>
  pg({ t: tableName })
    .select('max_height')
    .limit(1)
    .orderBy('max_height', 'desc')
    .toString();

/** selectLastExchangeTx :: String query */
const selectLastExchangeTx = () =>
  pg({ t: 'txs_7' })
    .select('height')
    .limit(1)
    .orderBy('height', 'desc')
    .toString();

/** selectLastExchangeTx :: String query */
const selectMinTimestampFromHeight = height =>
  pg.raw(`select min(time_stamp) as time_stamp 
          from (
            select time_stamp from txs_7 where height >= ${height} order by time_stamp
          ) as t`).toString();

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
        )} on conflict (time_start, amount_asset_id, price_asset_id, matcher, interval_in_secs) do update set ${updatedFieldsExcluded}`
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
          .where('interval_in_secs', shortInterval)
          .whereRaw(
            `time_start >= to_timestamp(floor(extract('epoch' from '${fromTimestamp.toISOString()}'::timestamp) / ${longerInterval}) * ${longerInterval})`
          )
          .groupBy('candle_time', 'amount_asset_id', 'price_asset_id', 'matcher');
      })} on conflict (time_start, amount_asset_id, price_asset_id, matcher, interval_in_secs) do update set ${updatedFieldsExcluded}`
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
      .innerJoin(
        { a_dec: 'asset_decimals' },
        'e.amount_asset',
        'a_dec.asset_id'
      )
      .innerJoin({ p_dec: 'asset_decimals' }, 'e.price_asset', 'p_dec.asset_id')
      .groupByRaw('e.candle_time, e.amount_asset, e.price_asset, e.sender');
  }).toString();

/** insertAllCandles :: (String, Number, Number, Number) -> String query */
const insertAllCandles = (tableName, shortInterval, longerInterval) =>
  insertIntoCandlesFromSelect(tableName, function() {
    this.from({ t: tableName })
      .column(makeCandleCalculateColumns(longerInterval))
      .where('t.interval_in_secs', shortInterval)
      .groupBy(['candle_time', 'amount_asset_id', 'price_asset_id', 'matcher']);
  }).toString();

/** selectCandlesByMinute :: Date -> String query */
const selectCandlesByMinute = fromTimetamp =>
  pg
    .columns(candleSelectColumns)
    .from(
      selectExchangesAfterTimestamp(fromTimetamp)
        .clone()
        .as('e')
    )
    .innerJoin({ a_dec: 'asset_decimals' }, 'e.amount_asset', 'a_dec.asset_id')
    .innerJoin({ p_dec: 'asset_decimals' }, 'e.price_asset', 'p_dec.asset_id')
    .groupBy(['e.candle_time', 'e.amount_asset', 'e.price_asset', 'e.sender'])
    .toString();

module.exports = {
  truncateTable,
  insertAllMinuteCandles,
  insertAllCandles,
  selectCandlesByMinute,
  insertOrUpdateCandles,
  selectLastCandle,
  selectLastExchangeTx,
  insertOrUpdateCandlesFromShortInterval,
  selectMinTimestampFromHeight,
};
