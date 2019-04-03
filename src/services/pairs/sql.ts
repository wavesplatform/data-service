import * as knex from 'knex';
import { compose } from 'ramda';

const pg = knex({ client: 'pg' });

const COLUMNS = [
  'amount_asset_id',
  'price_asset_id',
  'first_price',
  'last_price',
  'volume',
  'quote_volume',
  'high',
  'low',
  'weighted_average_price',
  'txs_count',
  'volume_waves',
];

const query = (pairs: { amountAsset: string; priceAsset: string }[]): string =>
  pg({ t: 'pairs' })
    .select(COLUMNS)
    .whereIn(
      ['t.amount_asset_id', 't.price_asset_id'],
      pairs.map(pair => [pair.amountAsset, pair.priceAsset])
    )
    .toString();

const searchAssets = (qb: knex.QueryBuilder, query: string, t: string = 't') =>
  qb
    .table({ [t]: 'assets' })
    .where(`${t}.asset_id`, query)
    .orWhere(`${t}.asset_name`, 'like', `${query}%`)
    .orWhere(`${t}.ticker`, 'like', `${query}%`)
    .orWhereRaw(
      `to_tsvector(${t}.asset_name) @@ to_tsquery('${query
        .split(' ')
        .join(' & ')}:*')`
    );

export const get = (pair: {
  amountAsset: string;
  priceAsset: string;
}): string => query([pair]);
export const mget = query;
export const search = ({
  search,
  limit,
}: {
  search: string;
  limit: number;
}): string => {
  // asset - prefix search of amount or price assets
  // asset1/asset2 - prefix search of amount asset by asset1
  //                 and prefix search of price asset by asset2
  //                 or amount asset by asset2 and price asset by asset1
  const [asset1, priceAsset] = search.split('/');
  const amountAsset = !asset1.length ? priceAsset : asset1;

  const q = pg({ t: 'pairs' })
    .select(COLUMNS.map(column => `t.${column}`))
    .limit(limit);

  return compose(
    q => q.toString(),
    q => q.orderByRaw('volume_waves desc NULLS LAST'),
    (q: knex.QueryBuilder) =>
      priceAsset
        ? q
            .with('assets_cte', (qb: knex.QueryBuilder) =>
              searchAssets(qb, amountAsset, 'a')
                .crossJoin(qb => searchAssets(qb, priceAsset, 'p').as('cj'))
                .select([
                  { amount_asset_id: 'a.asset_id' },
                  { price_asset_id: 'cj.asset_id' },
                ])
            )
            .innerJoin(
              { direct_cte: 'assets_cte' },
              {
                'direct_cte.amount_asset_id': 't.amount_asset_id',
                'direct_cte.price_asset_id': 't.price_asset_id',
              }
            )
            .unionAll((qb: knex.QueryBuilder) =>
              qb
                .select(COLUMNS.map(column => `t1.${column}`))
                .from({ t1: 'pairs' })
                .innerJoin(
                  { reverse_cte: 'assets_cte' },
                  {
                    'reverse_cte.amount_asset_id': 't1.price_asset_id',
                    'reverse_cte.price_asset_id': 't1.amount_asset_id',
                  }
                )
            )
        : q
            .with('assets_cte', (qb: knex.QueryBuilder) =>
              searchAssets(qb, amountAsset)
            )
            .innerJoin(
              { amountCte: 'assets_cte' },
              'amountCte.asset_id',
              't.amount_asset_id'
            )
            .innerJoin(
              { priceCte: 'assets_cte' },
              'priceCte.asset_id',
              't.amount_asset_id'
            )
  )(q);
};
