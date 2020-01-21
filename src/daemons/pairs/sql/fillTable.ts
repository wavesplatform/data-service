import * as knex from 'knex';
const pg = knex({ client: 'pg' });

const selectExchanges = pg({ t: 'txs_7' })
  .select({
    tx_uid: 't.tx_uid',
    amount_asset_uid: pg.raw('coalesce(t.amount_asset_uid, 0)'),
    price_asset_uid: pg.raw('coalesce(t.price_asset_uid, 0)'),
    amount: 't.amount',
    price: 't.price',
    time_stamp: 't.time_stamp',
    sender_uid: 't.sender_uid',
  })
  .where(
    't.tx_uid',
    '>=',
    pg('txs')
      .select('uid')
      .from('txs')
      .whereRaw(`time_stamp >= now() - interval '1 day'`)
      .limit(1)
  )
  .orderBy('t.tx_uid', 'desc');

const selectPairsCTE = pg
  .with('pairs_cte', qp => {
    qp.select({
      amount_asset_uid: 'amount_asset_uid',
      price_asset_uid: 'price_asset_uid',
      last_price: pg.raw(
        '(array_agg(e.price * 10 ^(-8 - p.decimals + a.decimals) ORDER BY e.tx_uid DESC)::numeric[])[1]'
      ),
      first_price: pg.raw(
        '(array_agg(e.price * 10 ^(-8 - p.decimals + a.decimals) ORDER BY e.tx_uid)::numeric[])[1]'
      ),
      volume: pg.raw('sum(e.amount * 10 ^(-a.decimals))'),
      quote_volume: pg.raw(
        'sum(e.amount * 10 ^(-a.decimals) * e.price * 10 ^(-8 - p.decimals + a.decimals))'
      ),
      weighted_average_price: pg.raw(
        'sum(e.amount * 10 ^(-a.decimals) * e.price * 10 ^(-8 - p.decimals + a.decimals))/ sum(e.amount * 10 ^(-a.decimals))'
      ),
      volume_waves: pg.raw(
        'case when amount_asset_uid=0 then sum(e.amount * 10 ^(- a.decimals)) when price_asset_uid=0 then sum(e.amount * 10 ^(-a.decimals) * e.price * 10 ^(-8 - p.decimals + a.decimals)) end'
      ),
      high: pg.raw('max(e.price * 10 ^(-8 - p.decimals + a.decimals))'),
      low: pg.raw('min(e.price * 10 ^(-8 - p.decimals + a.decimals))'),
      txs_count: pg.raw('count(e.price)'),
      matcher_address_uid: 'sender_uid',
    })
      .from(selectExchanges.clone().as('e'))
      .leftJoin({ a: 'assets' }, 'e.amount_asset_uid', 'a.uid')
      .leftJoin({ p: 'assets' }, 'e.price_asset_uid', 'p.uid')
      .groupBy(['amount_asset_uid', 'price_asset_uid', 'sender_uid']);
  })
  .from({ p: 'pairs_cte' })
  .columns(
    'p.amount_asset_uid',
    'p.price_asset_uid',
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
    'p.matcher_address_uid'
  )
  .leftJoin({ p1: 'pairs_cte' }, function() {
    this.on(pg.raw('p1.amount_asset_uid is null'))
      .andOn('p1.price_asset_uid', 'p.price_asset_uid')
      .andOn('p1.matcher_address_uid', 'p.matcher_address_uid');
  })
  .leftJoin({ p2: 'pairs_cte' }, function() {
    this.on('p2.amount_asset_uid', 'p.amount_asset_uid')
      .andOn(pg.raw('p2.price_asset_uid is null'))
      .andOn('p2.matcher_address_uid', 'p.matcher_address_uid');
  });

export const fillTable = (tableName: string): string =>
  pg
    .into(tableName)
    .insert(selectPairsCTE)
    .toString();
