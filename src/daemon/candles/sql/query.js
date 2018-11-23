const knex = require('knex');
const pg = knex({ client: 'pg' });
const { compose, map, concat, flip } = require('ramda');
const Maybe = require('folktale/maybe');

const tap = require('../../../utils/tap');

const exchangeColumns = [
  'amount_asset',
  'price_asset',
  'height',
  pg.raw(`date_trunc('minute', t.time_stamp) as candle_time`),
  pg.raw(`t.amount * 10 ^(-a_dec.decimals) as real_amount`),
  pg.raw(`t.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals) as real_price`),
];

const candleSelectColumns = [
  pg.raw('e.candle_time as time_start'),
  'amount_asset as amount_asset_id',
  'price_asset as price_asset_id',
  pg.raw('min(e.real_price) as low'),
  pg.raw('max(e.real_price) as high'),
  pg.raw('sum(e.real_amount) as volume'),
  pg.raw('sum(e.real_amount * e.real_price) as price_volume'),
  pg.raw('max(height) as max_height'),
  pg.raw('count(e.real_price) as txs_count'),
  pg.raw(
    'sum(e.real_amount * e.real_price)/sum(e.real_amount) as weighted_average_price'
  ),
  pg.raw('(array_agg(e.real_price)::numeric[])[1] as open'),
  pg.raw(
    '(array_agg(e.real_price)::numeric[])[array_length(array_agg(e.real_price)::numeric[], 1)] as close'
  ),
];

const selectExchangesBetweenTick = (startTick, endTick) =>
  selectExchanges()
    .clone()
    .whereBetween('t.time_stamp', [
      startTick.toGMTString(),
      endTick.toISOString(),
    ]);

const selectLastCandle = () =>
  pg({ t: 'candles' })
    .select('*')
    .limit(1)
    .orderByRaw('time_start desc');

const selectLastExchange = () =>
  pg({ t: 'txs_7' })
    .select('*')
    .limit(1)
    .orderByRaw('height desc');

const selectExchanges = () =>
  pg({ t: 'txs_7' })
    .columns(exchangeColumns)
    .innerJoin({ a_dec: 'asset_decimals' }, 't.amount_asset', 'a_dec.asset_id')
    .innerJoin({ p_dec: 'asset_decimals' }, 't.price_asset', 'p_dec.asset_id');

const selectCandlesByMinute = (startTick, endTick) =>
  pg({ t: 'txs_7' })
    .columns(candleSelectColumns)
    .select()
    .from(
      selectExchangesBetweenTick(startTick, endTick)
        .clone()
        .as('e')
    )
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

const insertOrUpdateCandles = candles =>
  compose(
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
    map(() => insertCandle(candles).toString()),
    () => (candles.length ? Maybe.of(candles) : Maybe.Nothing())
  )();

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
