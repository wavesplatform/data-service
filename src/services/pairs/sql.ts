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

type LimitedSearchRequest = {
  limit: number;
};

type SearchByAssetRequest = LimitedSearchRequest & {
  search_by_asset: string;
  match_exactly?: boolean;
};

type SearchByAssetsRequest = LimitedSearchRequest & {
  search_by_assets: [string, string];
  match_exactly?: [boolean, boolean];
};

type SearchRequest =
  | LimitedSearchRequest
  | SearchByAssetRequest
  | SearchByAssetsRequest;

const isNonEmptySearchRequest = (
  req: SearchRequest
): req is SearchByAssetRequest | SearchByAssetsRequest =>
  (typeof req === 'object' &&
    req !== null &&
    req.hasOwnProperty('search_by_asset')) ||
  req.hasOwnProperty('search_by_assets');

const isSearchByAssetRequest = (
  searchByAssetRequest: SearchRequest
): searchByAssetRequest is SearchByAssetRequest => {
  return (
    typeof searchByAssetRequest === 'object' &&
    searchByAssetRequest !== null &&
    searchByAssetRequest.hasOwnProperty('search_by_asset')
  );
};

const isMatchExactlyArray = (
  matchExactly: boolean | boolean[]
): matchExactly is Array<boolean> => {
  return Array.isArray(matchExactly);
};

const query = (pairs: { amountAsset: string; priceAsset: string }[]): string =>
  pg({ t: 'pairs' })
    .select(COLUMNS)
    .whereIn(
      ['t.amount_asset_id', 't.price_asset_id'],
      pairs.map(pair => [pair.amountAsset, pair.priceAsset])
    )
    .toString();

const searchAssets = (
  qb: knex.QueryBuilder,
  query: string,
  exactly: boolean,
  t: string = 't'
) =>
  qb
    .table({ [t]: 'assets' })
    .column({ asset_id: `${t}.asset_id` })
    .where(`${t}.asset_id`, query)
    .orWhere(`${t}.asset_name`, 'ilike', `${query}${exactly ? '' : '%'}`)
    .orWhere(`${t}.ticker`, 'like', `${query}${exactly ? '' : '%'}`)
    .orWhereRaw(
      `to_tsvector(${t}.asset_name) @@ to_tsquery('${query
        .replace(/[()]/g, '')
        .split(' ')
        .join(exactly ? ' & ' : ':* & ')}${exactly ? '' : ':*'}')`
    )
    .unionAll(q =>
      q
        .from({ [`${t}2`]: 'assets_metadata' })
        .column({ asset_id: `${t}2.asset_id` })
        .where(`${t}2.asset_name`, 'ilike', `${query}${exactly ? '' : '%'}`)
    );

export const get = (pair: {
  amountAsset: string;
  priceAsset: string;
}): string => query([pair]);
export const mget = query;
export const search = (req: SearchRequest): string => {
  const { limit } = req;

  const q = pg({ t: 'pairs' })
    .select(COLUMNS.map(column => `t.${column}`))
    .limit(limit);

  if (!isNonEmptySearchRequest(req)) {
    return q.toString();
  } else {
    // asset - prefix search of amount or price assets
    // asset1/asset2 - prefix search of amount asset by asset1
    //                 and prefix search of price asset by asset2
    //                 or amount asset by asset2 and price asset by asset1
    const [amountAsset, priceAsset] = isSearchByAssetRequest(req)
      ? [req.search_by_asset, undefined]
      : req.search_by_assets;

    const { match_exactly } = req;
    const [amountAssetExactly, priceAssetExaclty] = match_exactly
      ? isMatchExactlyArray(match_exactly)
        ? match_exactly
        : [match_exactly, false]
      : [false, false];

    return compose(
      q => q.toString(),
      q => q.orderByRaw('volume_waves desc NULLS LAST'),
      (q: knex.QueryBuilder) =>
        priceAsset
          ? q
              .with('assets_cte', (qb: knex.QueryBuilder) =>
                qb
                  .select({
                    amount_asset_id: 't1.asset_id',
                    price_asset_id: 't2.asset_id',
                  })
                  .from({
                    t1: searchAssets(
                      pg(),
                      amountAsset,
                      amountAssetExactly,
                      'a'
                    ),
                  })
                  .crossJoin((qb: knex.QueryBuilder) =>
                    searchAssets(qb, priceAsset, priceAssetExaclty, 'p').as(
                      't2'
                    )
                  )
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
                searchAssets(qb, amountAsset, amountAssetExactly)
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
  }
};
