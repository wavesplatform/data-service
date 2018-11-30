const knex = require('knex');
const pg = knex({ client: 'pg' });

const { serializeCandle, candlePresets } = require('./utils');

const insertManyIntoCandles = (tableName, selectFunction) =>
  pg.into(tableName).insert(selectFunction);

/** candleCalculateColumns :: Number -> Array */
const candleCalculateColumns = longerInterval => [
  candlePresets.aggregate.candle_time(longerInterval),
  'amount_asset_id',
  'price_asset_id',
  candlePresets.aggregate.low,
  candlePresets.aggregate.high,
  candlePresets.aggregate.volume,
  candlePresets.aggregate.price_volume,
  candlePresets.aggregate.max_height,
  candlePresets.aggregate.txs_count,
  candlePresets.aggregate.weighted_average_price,
  candlePresets.aggregate.open,
  candlePresets.aggregate.close,
  candlePresets.aggregate.interval_in_secs(longerInterval),
];

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
    price_volume: pg.raw(
      'sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))'
    ),
  },
  {
    max_height: pg.max('height'),
  },
  {
    txs_count: pg.raw(
      'count(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))'
    ),
  },
  {
    weighted_average_price: pg.raw(
      'sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))/sum(e.amount * 10 ^(-a_dec.decimals))'
    ),
  },
  {
    open: pg.raw(
      '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))::numeric[])[1]'
    ),
  },
  {
    close: pg.raw(
      '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))::numeric[])[array_length(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))::numeric[], 1)]'
    ),
  },
  {
    interval_in_secs: 60,
  },
];

/** selectExchanges :: QueryBuilder */
const selectExchanges = pg({ t: 'txs_7' }).column(
  'amount_asset',
  'price_asset',
  'height',
  { candle_time: pg.raw(`date_trunc('minute', t.time_stamp)`) },
  `amount`,
  `price`
);

/** selectExchangesAfterBlock :: Number -> QueryBuilder */
const selectExchangesAfterBlock = startBlock =>
  selectExchanges.clone().where('t.height', '>=', startBlock);

/** selectLastCandle :: String -> String query */
const selectLastCandle = tableName =>
  pg({ t: tableName })
    .select('*') // @todo height only?
    .limit(1)
    .orderBy('max_height', 'desc')
    .toString();

/** selectLastExchange :: String query */
const selectLastExchange = () =>
  pg({ t: 'txs_7' })
    .select('*') // @todo height only?
    .limit(1)
    .orderBy('height', 'desc')
    .toString();

// @todo add comment explain
const updatedFieldsExcluded = [
  'open',
  'close',
  'low',
  'high',
  'max_height',
  'price_volume',
  'txs_count',
  'volume',
  'weighted_average_price',
  'interval_in_secs',
]
  .map(field => field + '=EXCLUDED.' + field)
  .join(', ');

/** insertOrUpdateCandles :: (String, Array[Object]) -> String query */
const insertOrUpdateCandles = (tableName, candles) =>
  pg
    .raw(
      `${pg({ t: tableName }).insert(
        candles.map(serializeCandle)
      )} on conflict (time_start,amount_asset_id, price_asset_id, interval_in_secs) do update set ${updatedFieldsExcluded}`
    )
    .toString();

/** calculateCandles :: (String, Number, Number, Number) -> String query */
const calculateCandles = (
  tableName,
  shortInterval,
  longerInterval,
  startHeight
) =>
  pg
    .raw(
      `${insertManyIntoCandles(tableName, function() {
        this.from(
          pg(tableName)
            .select('*')
            .where('interval_in_secs', shortInterval)
            .where('max_height', '>=', startHeight)
            .as('d')
        )
          .column(candleCalculateColumns(longerInterval))
          .groupBy('candle_time', 'amount_asset_id', 'price_asset_id');
      })} on conflict (time_start,amount_asset_id, price_asset_id, interval_in_secs) do update set ${updatedFieldsExcluded}`
    )
    .toString();

/** dropTable :: String -> String query */
const dropTable = tableName =>
  pg(tableName)
    .truncate()
    .toString();

/** insertAllMinuteCandles :: String -> String query */
const insertAllMinuteCandles = tableName =>
  insertManyIntoCandles(tableName, function() {
    this.from({ t: 'txs_7' })
      .columns(candleSelectColumns)
      .select()
      .from(selectExchanges.clone().as('e'))
      .innerJoin(
        { a_dec: 'asset_decimals' },
        'e.amount_asset',
        'a_dec.asset_id'
      )
      .innerJoin({ p_dec: 'asset_decimals' }, 'e.price_asset', 'p_dec.asset_id')
      .groupByRaw('e.amount_asset, e.price_asset, e.candle_time')
      .toString();
  }).toString();

/** calculateAllCandles :: (String, Number, Number, Number) -> String query */
const calculateAllCandles = (tableName, shortInterval, longerInterval) =>
  insertManyIntoCandles(tableName, function() {
    this.from({ t: tableName })
      .column(candleCalculateColumns(longerInterval))
      .select()
      .where('t.interval_in_secs', shortInterval)
      .groupBy(['candle_time', 'amount_asset_id', 'price_asset_id']);
  }).toString();

/** selectCandlesByMinute :: Number -> String query */
const selectCandlesByMinute = startHeight =>
  pg({ t: 'txs_7' })
    .columns(candleSelectColumns)
    .select()
    .from(
      selectExchangesAfterBlock(startHeight)
        .clone()
        .as('e')
    )
    .innerJoin({ a_dec: 'asset_decimals' }, 'e.amount_asset', 'a_dec.asset_id')
    .innerJoin({ p_dec: 'asset_decimals' }, 'e.price_asset', 'p_dec.asset_id')
    .groupBy(['e.amount_asset', 'e.price_asset', 'e.candle_time'])
    .toString();

module.exports = {
  dropTable,
  insertAllMinuteCandles,
  calculateAllCandles,
  selectCandlesByMinute,
  insertOrUpdateCandles,
  selectLastCandle,
  selectLastExchange,
  calculateCandles,
};
