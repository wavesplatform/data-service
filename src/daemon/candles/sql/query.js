const knex = require('knex');
const pg = knex({ client: 'pg' });
const { compose, map, concat, flip } = require('ramda');
const Maybe = require('folktale/maybe');

const exchangeColumns = [
  'amount_asset',
  'price_asset',
  'height',
  pg.raw(`date_trunc('minute', t.time_stamp) as candle_time`),
  pg.raw(`amount`),
  pg.raw(`price`),
];

const candleSelectColumns = [
  pg.raw('e.candle_time as time_start'),
  'amount_asset as amount_asset_id',
  'price_asset as price_asset_id',
  pg.raw('min(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) as low'),
  pg.raw('max(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) as high'),
  pg.raw('sum(e.amount * 10 ^(-a_dec.decimals)) as volume'),
  pg.raw('sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) as price_volume'),
  pg.raw('max(height) as max_height'),
  pg.raw('count(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) as txs_count'),
  pg.raw(
    'sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))/sum(e.amount * 10 ^(-a_dec.decimals)) as weighted_average_price'
  ),
  pg.raw('(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))::numeric[])[1] as open'),
  pg.raw(
    '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))::numeric[])[array_length(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))::numeric[], 1)] as close'
  ),
];

const selectExchangesAfterBlock = startBlock =>
  selectExchanges()
    .clone()
    .whereRaw(`t.height >= ${startBlock}`);

const selectLastCandle = () =>
  pg({ t: 'candles' })
    .select('*')
    .limit(1)
    .orderByRaw('max_height desc');

const selectLastExchange = () =>
  pg({ t: 'txs_7' })
    .select('*')
    .limit(1)
    .orderByRaw('height desc');

const selectExchanges = () =>
  pg({ t: 'txs_7' })
    .columns(exchangeColumns);

const selectCandlesByMinute = startBlock =>
  pg({ t: 'txs_7' })
    .columns(candleSelectColumns)
    .select()
    .from(
      selectExchangesAfterBlock(startBlock)
        .clone()
        .as('e')
    )
    .innerJoin({ a_dec: 'asset_decimals' }, 'e.amount_asset', 'a_dec.asset_id')
    .innerJoin({ p_dec: 'asset_decimals' }, 'e.price_asset', 'p_dec.asset_id')
    .groupByRaw('e.amount_asset, e.price_asset, e.candle_time');

const selectAllCandlesByMinute = instance =>
  instance
    .from({ t: 'txs_7' })
    .columns(candleSelectColumns)
    .select()
    .from(
      selectExchanges()
        .clone()
        .as('e')
    )
    .innerJoin({ a_dec: 'asset_decimals' }, 'e.amount_asset', 'a_dec.asset_id')
    .innerJoin({ p_dec: 'asset_decimals' }, 'e.price_asset', 'p_dec.asset_id')
    .groupByRaw('e.amount_asset, e.price_asset, e.candle_time');

const candleToQuery = candle => ({
  time_start: candle.time_start,
  amount_asset_id: candle.amount_asset_id,
  price_asset_id: candle.price_asset_id,
  low: candle.low.toNumber(),
  high: candle.high.toNumber(),
  volume: candle.volume.toNumber(),
  price_volume: candle.price_volume.toNumber(),
  max_height: candle.max_height,
  txs_count: candle.txs_count.toNumber(),
  weighted_average_price: candle.weighted_average_price.toNumber(),
  open: candle.open.toNumber(),
  close: candle.close.toNumber(),
});

const updatedFields = [
  'open',
  'close',
  'low',
  'high',
  'max_height',
  'price_volume',
  'txs_count',
  'volume',
  'weighted_average_price',
];

const insertCandle = candles => pg({ t: 'candles' }).insert(candles);

const insertOrUpdateCandles = compose(
  m => m.getOrElse(';'),
  map(
    flip(concat)(
      updatedFields.map(field => field + '=EXCLUDED.' + field).join(', ')
    )
  ),
  map(
    flip(concat)(
      ' on conflict (time_start,amount_asset_id, price_asset_id) do update set '
    )
  ),
  map(candles => insertCandle(candles).toString()),
  candles => (candles.length ? Maybe.of(candles) : Maybe.Nothing())
);

const createCandlesTable = pg.schema
  .dropTableIfExists('candles')
  .createTable('candles', table => {
    table.timestamp('time_start').notNullable();
    table.string('amount_asset_id').notNullable();
    table.string('price_asset_id').notNullable();
    table.decimal('low', null, null).notNullable();
    table.decimal('high', null, null).notNullable();
    table.decimal('volume', null, null).notNullable();
    table.decimal('price_volume', null, null).notNullable();
    table.integer('max_height').notNullable();
    table.integer('txs_count').notNullable();
    table.decimal('weighted_average_price', null, null).notNullable();
    table.decimal('open', null, null).notNullable();
    table.decimal('close', null, null).notNullable();
    table.primary(['time_start', 'amount_asset_id', 'price_asset_id']);
    table.index(['max_height']);
  })
  .raw('alter table "candles" owner to dba;');

const updateCandlesAll = pg({})
  .into('candles')
  .insert(function() {
    selectAllCandlesByMinute(this);
  });

module.exports = {
  selectCandlesByMinute,
  insertOrUpdateCandles,
  candleToQuery,
  createCandlesTable,
  updateCandlesAll,
  selectLastCandle,
  selectLastExchange,
};
