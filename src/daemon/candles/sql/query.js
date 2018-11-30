const knex = require('knex');
const pg = knex({ client: 'pg' });

const { map, compose } = require('ramda');

const { serializeCandle } = require('./utils');

const insertManyIntoCandles = selectFunction =>
  pg({})
    .into('candles')
    .insert(selectFunction);

const candleSelectColumns = [
  pg.raw('e.candle_time as time_start'),
  'amount_asset as amount_asset_id',
  'price_asset as price_asset_id',
  pg.raw('min(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) as low'),
  pg.raw('max(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) as high'),
  pg.raw('sum(e.amount * 10 ^(-a_dec.decimals)) as volume'),
  pg.raw(
    'sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) as price_volume'
  ),
  pg.raw('max(height) as max_height'),
  pg.raw(
    'count(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) as txs_count'
  ),
  pg.raw(
    'sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))/sum(e.amount * 10 ^(-a_dec.decimals)) as weighted_average_price'
  ),
  pg.raw(
    '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))::numeric[])[1] as open'
  ),
  pg.raw(
    '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))::numeric[])[array_length(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))::numeric[], 1)] as close'
  ),
  pg.raw('1 as fold'),
];

// selectExchanges:: QueryBuilder
const selectExchanges = pg({ t: 'txs_7' })
  .columns([
    'amount_asset',
    'price_asset',
    'height',
    pg.raw(`date_trunc('minute', t.time_stamp) as candle_time`),
    `amount`,
    `price`,
  ])
  .select()
  .toString();

// selectExchangesAfterBlock:: Number -> QueryBuilder
const selectExchangesAfterBlock = startBlock =>
  selectExchanges
    .clone()
    .whereRaw(`t.height >= ${startBlock}`)
    .toString();

const selectLastCandle = () =>
  pg({ t: 'candles' })
    .select('*')
    .limit(1)
    .orderByRaw('max_height desc')
    .toString();

const selectLastExchange = () =>
  pg({ t: 'txs_7' })
    .select('*')
    .limit(1)
    .orderByRaw('height desc')
    .toString();

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
    .groupByRaw('e.amount_asset, e.price_asset, e.candle_time')
    .toString();

const foldCandlesBy = (instance, fromFold, fold) =>
  instance
    .from({ t: 'candles' })
    .columns([
      pg.raw(
        `to_timestamp(floor((extract('epoch' from time_start) / ${fold} )) * ${fold}) as candle_time`
      ),
      'amount_asset_id',
      'price_asset_id',
      pg.raw('min(low) as low'),
      pg.raw('max(high) as high'),
      pg.raw('sum(volume) as volume'),
      pg.raw('sum(price_volume) as price_volume'),
      pg.raw('max(max_height) as max_height'),
      pg.raw('sum(txs_count) as txs_count'),
      pg.raw(
        'sum(price_volume * volume) / sum(volume) as weighted_average_price'
      ),
      pg.raw('(array_agg(open)::numeric[])[1] as open'),
      pg.raw(
        '(array_agg(close)::numeric[])[array_length(array_agg(close)::numeric[],1)] as close'
      ),
      pg.raw(`${fold} as fold`),
    ])
    .select()
    .whereRaw(`t.fold=${fromFold}`)
    .groupByRaw('candle_time, amount_asset_id, price_asset_id')
    .toString();

const selectAllCandlesByMinute = instance =>
  instance
    .from({ t: 'txs_7' })
    .columns(candleSelectColumns)
    .select()
    .from(selectExchanges.clone().as('e'))
    .innerJoin({ a_dec: 'asset_decimals' }, 'e.amount_asset', 'a_dec.asset_id')
    .innerJoin({ p_dec: 'asset_decimals' }, 'e.price_asset', 'p_dec.asset_id')
    .groupByRaw('e.amount_asset, e.price_asset, e.candle_time')
    .toString();

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
  'fold',
]
  .map(field => field + '=EXCLUDED.' + field)
  .join(', ');

const insertOrUpdateCandles = candles =>
  pg
    .raw(
      `${pg({ t: 'candles' }).insert(
        candles.map(serializeCandle)
      )} on conflict (time_start,amount_asset_id, price_asset_id, fold) do update set ${updatedFieldsExcluded}`
    )
    .toString();

const selectFold = (fromFold, fold, startBlock, instance) =>
  instance
    .from(
      pg('candles')
        .select()
        .whereRaw(`fold=${fromFold} and max_height >= ${startBlock}`)
        .as('d')
    )
    .columns([
      pg.raw(
        `to_timestamp(floor((extract('epoch' from time_start) / ${fold} )) * ${fold}) as candle_time`
      ),
      'amount_asset_id',
      'price_asset_id',
      pg.raw('min(low) as low'),
      pg.raw('max(high) as high'),
      pg.raw('sum(volume) as volume'),
      pg.raw('sum(price_volume) as price_volume'),
      pg.raw('max(max_height) as max_height'),
      pg.raw('sum(txs_count) as txs_count'),
      pg.raw(
        'sum(price_volume * volume) / sum(volume) as weighted_average_price'
      ),
      pg.raw('(array_agg(open)::numeric[])[1] as open'),
      pg.raw(
        '(array_agg(close)::numeric[])[array_length(array_agg(close)::numeric[],1)] as close'
      ),
      pg.raw(`${fold} as fold`),
    ])
    .groupByRaw('candle_time, amount_asset_id, price_asset_id')
    .toString();

const updateCandlesBy = (fromFold, fold, startBlock) =>
  pg
    .raw(
      `${insertManyIntoCandles(function() {
        selectFold(fromFold, fold, startBlock, this);
      })} on conflict (time_start,amount_asset_id, price_asset_id, fold) do update set ${updatedFieldsExcluded}`
    )
    .toString();

// createCandlesTable:: QueryBuilder
const createCandlesTable = () =>
  pg.schema
    .dropTableIfExists('candles')
    .createTable('candles', table => {
      table.timestamp('time_start', true).notNullable();
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
      table.integer('fold').notNullable();
      table.primary([
        'fold',
        'time_start',
        'amount_asset_id',
        'price_asset_id',
      ]);
      table.index(['max_height']);
    })
    .raw('alter table "candles" owner to dba;')
    .toString();

const updateMinutesCandlesAll = () =>
  insertManyIntoCandles(function() {
    selectAllCandlesByMinute(this);
  }).toString();

const insertAllCandlesBy = (fromFold, fold) =>
  insertManyIntoCandles(function() {
    foldCandlesBy(this, fromFold, fold);
  }).toString();

module.exports = {
  selectCandlesByMinute,
  insertOrUpdateCandles,
  createCandlesTable,
  updateMinutesCandlesAll,
  selectLastCandle,
  selectLastExchange,
  insertAllCandlesBy,
  updateCandlesBy,
};
