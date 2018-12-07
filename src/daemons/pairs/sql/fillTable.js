const knex = require('knex');
const pg = knex({ client: 'pg' });

const selectVolumeWavesFromPairsCTE = pg({ d: 'pairs_cte' })
  .select({ volume_waves: pg.raw('p.volume * d.weighted_average_price') })
  .whereRaw(`(d.amount_asset_id=p.price_asset_id AND d.price_asset_id='WAVES')`)
  .orWhereRaw(
    `(d.price_asset_id=p.price_asset_id AND d.amount_asset_id='WAVES')`
  );

const selectExchanges = pg('txs_7')
  .select(['price_asset', 'amount_asset', 'amount', 'price'])
  .whereRaw(`time_stamp >= now() - interval '1 day'`)
  .orderBy('time_stamp', 'desc');

const selectPairsCTE = pg
  .with('pairs_cte', qp => {
    qp.select({
      amount_asset_id: 'amount_asset',
      price_asset_id: 'price_asset',
      last_price: pg.raw(
        '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))::numeric[])[1]'
      ),
      first_price: pg.raw(
        '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))::numeric[])[array_length(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))::numeric[], 1)]'
      ),
      volume: pg.raw('sum(e.amount * 10 ^(-a_dec.decimals))'),
      volume_price: pg.raw(
        'sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))'
      ),
      weighted_average_price: pg.raw(
        'sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))/ sum(e.amount * 10 ^(-a_dec.decimals))'
      ),
      volume_waves: pg.raw(
        "case when amount_asset = 'WAVES' then sum(e.amount * 10 ^(-a_dec.decimals)) when price_asset = 'WAVES' then sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) end"
      ),
    })
      .from({ e: selectExchanges.clone() })
      .innerJoin(
        { a_dec: 'asset_decimals' },
        'e.amount_asset',
        'a_dec.asset_id'
      )
      .innerJoin({ p_dec: 'asset_decimals' }, 'e.price_asset', 'p_dec.asset_id')
      .groupBy(['amount_asset', 'price_asset']);
  })
  .from({ p: 'pairs_cte' })
  .columns(
    'amount_asset_id',
    'price_asset_id',
    'first_price',
    'last_price',
    'volume',
    {
      volume_waves: pg.raw(
        `coalesce(volume_waves, (${selectVolumeWavesFromPairsCTE.toString()}))`
      ),
    }
  );

module.exports = tableName =>
  pg
    .into(tableName)
    .insert(selectPairsCTE)
    .toString();
