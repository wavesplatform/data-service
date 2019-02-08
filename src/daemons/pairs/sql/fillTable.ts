import * as knex from 'knex';
const pg = knex({ client: 'pg' });

const selectVolumeWavesFromPairsCTE = pg({ d: 'pairs_cte' })
  .select(
    pg.raw(
      `case when d.amount_asset_id='WAVES' then p.quote_volume / d.weighted_average_price when d.price_asset_id='WAVES' then p.quote_volume * d.weighted_average_price end as volume_waves`
    )
  )
  .whereRaw(`(d.amount_asset_id=p.price_asset_id AND d.price_asset_id='WAVES')`)
  .orWhereRaw(
    `(d.price_asset_id=p.price_asset_id AND d.amount_asset_id='WAVES')`
  );

const selectExchanges = pg('txs_7')
  .select(['price_asset', 'amount_asset', 'amount', 'price', 'time_stamp'])
  .whereRaw(`time_stamp >= now() - interval '1 day'`)
  .orderBy('time_stamp', 'desc');

const selectPairsCTE = pg
  .with('pairs_cte', qp => {
    qp.select([
      { amount_asset_id: 'amount_asset' },
      { price_asset_id: 'price_asset' },
      pg.raw(
        '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals) ORDER BY e.time_stamp DESC)::numeric[])[1] as last_price'
      ),
      pg.raw(
        '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals) ORDER BY e.time_stamp)::numeric[])[1] as first_price'
      ),
      pg.raw('sum(e.amount * 10 ^(-a_dec.decimals)) as volume'),
      pg.raw(
        'sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) as quote_volume'
      ),
      pg.raw(
        'sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))/ sum(e.amount * 10 ^(-a_dec.decimals)) as weighted_average_price'
      ),
      pg.raw(
        "case when amount_asset = 'WAVES' then sum(e.amount * 10 ^(-a_dec.decimals)) when price_asset = 'WAVES' then sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) end as volume_waves"
      ),
      pg.raw(
        'max(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) as high'
      ),
      pg.raw(
        'min(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) as low'
      ),
      pg.raw('count(e.price) as txs_count'),
    ])
      .from(selectExchanges.clone().as('e'))
      .innerJoin('asset_decimals as a_dec', 'e.amount_asset', 'a_dec.asset_id')
      .innerJoin('asset_decimals as p_dec', 'e.price_asset', 'p_dec.asset_id')
      .groupBy(['amount_asset', 'price_asset']);
  })
  .from({ p: 'pairs_cte' })
  .columns(
    'amount_asset_id',
    'price_asset_id',
    'first_price',
    'last_price',
    'volume',
    pg.raw(
      `coalesce(volume_waves, (${selectVolumeWavesFromPairsCTE.toString()})) as volume_waves`
    ),
    'quote_volume',
    'high',
    'low',
    'weighted_average_price',
    'txs_count'
  );

export const fillTable = (tableName: string): string =>
  pg
    .into(tableName)
    .insert(selectPairsCTE)
    .toString();
