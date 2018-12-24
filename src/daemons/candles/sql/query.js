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
    txs_count: pg.raw(
      'count(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))'
    ),
  },
  {
    weighted_average_price: pg.raw(
      'sum((e.amount * 10 ^(-a_dec.decimals))::numeric * (e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))::numeric)/sum((e.amount * 10 ^(-a_dec.decimals))::numeric)'
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

/** insertIntoCandlesFromSelect :: (String, Function) -> QueryBuilder */
const insertIntoCandlesFromSelect = (tableName, selectFunction) =>
  pg.into(tableName).insert(selectFunction);

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

/** for make complex query with "on conflict (...) update ... without set concrete values" See insertOrUpdateCandles or insertOrUpdateCandlesFromHeight */
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
  'interval_in_secs',
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
        )} on conflict (time_start,amount_asset_id, price_asset_id, interval_in_secs) do update set ${updatedFieldsExcluded}`
      )
      .toString();
  }

  return ';';
};

/** insertOrUpdateCandlesFromHeight :: (String, Number, Number) -> String query */
const insertOrUpdateCandlesFromHeight = (
  tableName,
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
            `time_start >= to_timestamp(floor((extract('epoch' from now()) / ${longerInterval} )) * ${longerInterval})`
          )
          .groupBy('candle_time', 'amount_asset_id', 'price_asset_id');
      })} on conflict (time_start,amount_asset_id, price_asset_id, interval_in_secs) do update set ${updatedFieldsExcluded}`
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

/** insertAllCandles :: (String, Number, Number, Number) -> String query */
const insertAllCandles = (tableName, shortInterval, longerInterval) =>
  insertIntoCandlesFromSelect(tableName, function() {
    this.from({ t: tableName })
      .column(makeCandleCalculateColumns(longerInterval))
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
  truncateTable,
  insertAllMinuteCandles,
  insertAllCandles,
  selectCandlesByMinute,
  insertOrUpdateCandles,
  selectLastCandle,
  selectLastExchangeTx,
  insertOrUpdateCandlesFromHeight,
};
