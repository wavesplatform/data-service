import * as knex from 'knex';
const pg = knex({ client: 'pg' });

const selectExchanges = pg('txs_7')
  .select([
    'price_asset',
    'amount_asset',
    'amount',
    'price',
    'time_stamp',
    'sender',
  ])
  .whereRaw(`time_stamp >= now() - interval '1 day'`)
  .orderBy('time_stamp', 'desc');

const selectPairsCTE = pg
  .with('pairs_cte', qp => {
    qp.select({
      amount_asset_id: 'amount_asset',
      price_asset_id: 'price_asset',
      last_price: pg.raw(
        '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals) ORDER BY e.time_stamp DESC)::numeric[])[1]'
      ),
      first_price: pg.raw(
        '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals) ORDER BY e.time_stamp)::numeric[])[1]'
      ),
      volume: pg.raw('sum(e.amount * 10 ^(-a_dec.decimals))'),
      quote_volume: pg.raw(
        'sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))'
      ),
      weighted_average_price: pg.raw(
        'sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))/ sum(e.amount * 10 ^(-a_dec.decimals))'
      ),
      volume_waves: pg.raw(
        "case when amount_asset = 'WAVES' then sum(e.amount * 10 ^(-a_dec.decimals)) when price_asset = 'WAVES' then sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) end"
      ),
      high: pg.raw('max(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))'),
      low: pg.raw('min(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))'),
      txs_count: pg.raw('count(e.price)'),
      matcher: 'sender',
    })
      .from(selectExchanges.clone().as('e'))
      .innerJoin('asset_decimals as a_dec', 'e.amount_asset', 'a_dec.asset_id')
      .innerJoin('asset_decimals as p_dec', 'e.price_asset', 'p_dec.asset_id')
      .groupBy(['amount_asset', 'price_asset', 'sender']);
  })
  .from({ p: 'pairs_cte' })
  .columns(
    'p.amount_asset_id',
    'p.price_asset_id',
    'p.first_price',
    'p.last_price',
    'p.volume',
    {
      volume_waves: pg.raw(
        `coalesce(p.volume_waves, p.quote_volume / p1.weighted_average_price, p.quote_volume * p2.weighted_average_price)`
      ),
    },
    'p.quote_volume',
    'p.high',
    'p.low',
    'p.weighted_average_price',
    'p.txs_count',
    'p.matcher'
  )
  .leftJoin('pairs_cte as p1', function() {
    this.on(pg.raw("p1.amount_asset_id='WAVES'"))
      .andOn('p1.price_asset_id', 'p.price_asset_id')
      .andOn('p1.matcher', 'p.matcher');
  })
  .leftJoin('pairs_cte as p2', function() {
    this.on('p2.amount_asset_id', 'p.amount_asset_id')
      .andOn(pg.raw("p2.price_asset_id='WAVES'"))
      .andOn('p2.matcher', 'p.matcher');
  });

export const fillTable = (tableName: string): string =>
  pg
    .into(tableName)
    .insert(selectPairsCTE)
    .toString();
