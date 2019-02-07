import * as knex from 'knex';
const pg = knex({ client: 'pg' });

const selectVolumeWavesFromPairsCTE = pg({ d: 'pairs_cte' })
  .select({
    volume_waves: pg
      .raw(
        `case when d.amount_asset_id='WAVES' then p.quote_volume / d.weighted_average_price when d.price_asset_id='WAVES' then p.quote_volume * d.weighted_average_price end`
      )
      .toString(),
  })
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
    qp.select({
      amount_asset_id: 'amount_asset',
      price_asset_id: 'price_asset',
      last_price: pg
        .raw(
          '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals) ORDER BY e.time_stamp DESC)::numeric[])[1]'
        )
        .toString(),
      first_price: pg
        .raw(
          '(array_agg(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals) ORDER BY e.time_stamp)::numeric[])[1]'
        )
        .toString(),
      volume: pg.raw('sum(e.amount * 10 ^(-a_dec.decimals))').toString(),
      quote_volume: pg
        .raw(
          'sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))'
        )
        .toString(),
      weighted_average_price: pg
        .raw(
          'sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))/ sum(e.amount * 10 ^(-a_dec.decimals))'
        )
        .toString(),
      volume_waves: pg
        .raw(
          "case when amount_asset = 'WAVES' then sum(e.amount * 10 ^(-a_dec.decimals)) when price_asset = 'WAVES' then sum(e.amount * 10 ^(-a_dec.decimals) * e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals)) end"
        )
        .toString(),
      high: pg
        .raw('max(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))')
        .toString(),
      low: pg
        .raw('min(e.price * 10 ^(-8 - p_dec.decimals + a_dec.decimals))')
        .toString(),
      txs_count: pg.raw('count(e.price)').toString(),
    })
      .from({ e: selectExchanges.clone().toString() })
      .innerJoin('a_dec as asset_decimals', 'e.amount_asset', 'a_dec.asset_id')
      .innerJoin('p_dec as asset_decimals', 'e.price_asset', 'p_dec.asset_id')
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
      volume_waves: pg
        .raw(
          `coalesce(volume_waves, (${selectVolumeWavesFromPairsCTE.toString()}))`
        )
        .toString(),
    },
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
