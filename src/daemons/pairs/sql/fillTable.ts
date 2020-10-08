import * as knex from 'knex';
const pg = knex({ client: 'pg' });

const selectExchanges = pg({ t: 'txs_7' })
  .select({
    tx_uid: 't.tx_uid',
    amount_asset_id: 't.amount_asset_id',
    price_asset_id: 't.price_asset_id',
    amount: 't.amount',
    price: 't.price',
    time_stamp: 't.time_stamp',
    sender: 't.sender',
  })
  .with('hp_cte', (qb) =>
    qb
      .select('uid')
      .from('txs')
      .whereRaw(`time_stamp >= now() - interval '1 day'`)
      .limit(1)
  )
  .where('t.tx_uid', pg('hp_cte').select('uid'))
  .orderBy('t.tx_uid', 'desc');

const selectPairsCTE = pg
  .with('pairs_cte', (qb) => {
    qb.select({
      amount_asset_id: 'amount_asset_id',
      price_asset_id: 'price_asset_id',
      last_price: pg.raw(
        '(array_agg(e.price ORDER BY e.tx_uid DESC)::numeric[])[1]'
      ),
      first_price: pg.raw(
        '(array_agg(e.price ORDER BY e.tx_uid)::numeric[])[1]'
      ),
      volume: pg.raw('sum(e.amount)'),
      quote_volume: pg.raw('sum(e.amount * e.price)'),
      weighted_average_price: pg.raw('sum(e.amount * e.price)/ sum(e.amount)'),
      volume_waves: pg.raw(
        `case when amount_asset_id='WAVES' then sum(e.amount) when price_asset_id='WAVES' then sum(e.amount * e.price) end`
      ),
      high: pg.raw('max(e.price)'),
      low: pg.raw('min(e.price)'),
      txs_count: pg.raw('count(e.price)'),
      matcher_address: 'sender',
    })
      .from(selectExchanges.clone().as('e'))
      .groupBy(['amount_asset_id', 'price_asset_id', 'sender']);
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
    'p.matcher_address'
  )
  .leftJoin({ p1: 'pairs_cte' }, function () {
    this.on(pg.raw(`p1.amount_asset_id='WAVES'`))
      .andOn('p1.price_asset_id', 'p.price_asset_id')
      .andOn('p1.matcher_address', 'p.matcher_address');
  })
  .leftJoin({ p2: 'pairs_cte' }, function () {
    this.on('p2.amount_asset_id', 'p.price_asset_id')
      .andOn(pg.raw(`p2.price_asset_id='WAVES'`))
      .andOn('p2.matcher_address', 'p.matcher_address');
  });

export const fillTable = (pairsTableName: string): string =>
  pg.into(pairsTableName).insert(selectPairsCTE).toString();
