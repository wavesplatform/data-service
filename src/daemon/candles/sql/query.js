const pg = require('knex')({ client: 'pg' });
const { compose, omit, keys } = require('ramda');

const exchangeColumns = [
  'amount_asset',
  'price_asset',
  'height',
  pg.raw(`date_trunc('minute', t.time_stamp) as candle_time`),
  pg.raw(`t.amount * 10 ^(-a_dec.decimals) as real_amount`),
  pg.raw(`t.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals) as real_price`),
];

const candleColumns = [
  'amount_asset',
  'price_asset',
  pg.raw('min(e.real_price) as low'),
  pg.raw('max(e.real_price) as hight'),
  pg.raw('sum(e.real_amount) as volume'),
  pg.raw('sum(e.real_amount * e.real_price) as price_volume'),
  pg.raw('max(height) as max_height'),
  pg.raw('count(e.real_price) as txs_count'),
  pg.raw('avg(e.real_price) as txs_count'),
  pg.raw('sum(e.real_amount * e.real_price)/sum(e.real_amount) as weighted_average_price'),
  pg.raw('(array_agg(e.real_price)::numeric[])[1] as open'),
  pg.raw('(array_agg(e.real_price)::numeric[])[array_length(array_agg(e.real_price)::numeric[], 1)] as close')
];

const selectExchangesBetweenTick = (startTick, endTick) =>
  pg({ t: 'txs_7' })
    .columns(exchangeColumns)
    .whereBetween('t.time_stamp', [
      startTick.toGMTString(),
      endTick.toISOString(),
    ])
    .innerJoin({ a_dec: 'asset_decimals' }, 't.amount_asset', 'a_dec.asset_id')
    .innerJoin({ p_dec: 'asset_decimals' }, 't.price_asset', 'p_dec.asset_id');

const selectEmptyPairsByMinute = (startTick, endTick) =>
  pg({ t: 'txs_7' })
    .columns(candleColumns)
    .select()
    .from(selectExchangesBetweenTick(startTick, endTick).as('e'))
    .groupByRaw('e.amount_asset, e.price_asset, e.candle_time');

module.exports = {
  selectEmptyPairsByMinute,
};
