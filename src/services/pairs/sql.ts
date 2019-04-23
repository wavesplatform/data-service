import * as knex from 'knex';

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

type SearchWithLimitRequest = {
  limit: number;
};

type SearchWithMatchExactly = SearchWithLimitRequest & {
  match_exactly?: boolean[];
};

type SearchByAssetRequest = SearchWithMatchExactly & {
  search_by_asset: string;
};

type SearchByAssetsRequest = SearchWithMatchExactly & {
  search_by_assets: [string, string];
};

type SearchRequest =
  | SearchWithLimitRequest
  | SearchByAssetRequest
  | SearchByAssetsRequest;

const isSearchByAssetRequest = (
  searchByAssetRequest: SearchRequest
): searchByAssetRequest is SearchByAssetRequest => {
  return (
    typeof searchByAssetRequest === 'object' &&
    searchByAssetRequest !== null &&
    searchByAssetRequest.hasOwnProperty('search_by_asset')
  );
};

const isSearchByAssetsRequest = (
  searchByAssetRequest: SearchRequest
): searchByAssetRequest is SearchByAssetsRequest => {
  return (
    typeof searchByAssetRequest === 'object' &&
    searchByAssetRequest !== null &&
    searchByAssetRequest.hasOwnProperty('search_by_assets')
  );
};

const getMatchExactly = (matchExactly: boolean[] | undefined): boolean[] => {
  const DEFAULT_MATCH_EXACTLY = false;

  if (typeof matchExactly === 'undefined') {
    return [DEFAULT_MATCH_EXACTLY, DEFAULT_MATCH_EXACTLY];
  } else {
    if (matchExactly.length === 1) {
      return [matchExactly[0], matchExactly[0]];
    } else {
      return matchExactly;
    }
  }
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
) => {
  // will be used on searchable_asset_name search
  const cleanedQuery = query.replace(/[^\w\s]|_/g, '');
  return qb
    .table({ [t]: 'assets' })
    .column({ asset_id: `${t}.asset_id` })
    .where(`${t}.asset_id`, query)
    .where(
      `${t}.ticker`,
      'like',
      `${query.replace('%', '\\%')}${exactly ? '' : '%'}`
    )
    .unionAll(q =>
      q
        .from({ [`${t}2`]: 'assets_metadata' })
        .column({ asset_id: `${t}2.asset_id` })
        .where(`${t}2.asset_name`, 'ilike', query.replace('%', '\\%'))
    )
    .unionAll(q =>
      q
        .from({ [`${t}3`]: 'assets_names_map' })
        .column({ asset_id: `${t}3.asset_id` })
        .whereRaw(`${t}3.searchable_asset_name @@ to_tsquery(?)`, [
          `${cleanedQuery}${cleanedQuery.length > 0 ? ':*' : ''}`,
        ])
        .orWhere(
          `${t}3.asset_name`,
          'ilike',
          `${query.replace('%', '\\%')}${exactly ? '' : '%'}`
        )
    );
};

export const get = (pair: {
  amountAsset: string;
  priceAsset: string;
}): string => query([pair]);
export const mget = query;
export const search = (req: SearchRequest): string => {
  // asset - prefix search of amount or price assets
  // asset1/asset2 - prefix search of amount asset by asset1
  //                 and prefix search of price asset by asset2
  //                 or amount asset by asset2 and price asset by asset1

  const { limit } = req;

  const q = pg({ t: 'pairs' })
    .select(COLUMNS.map(column => `t.${column}`))
    .orderByRaw('volume_waves desc NULLS LAST')
    .limit(limit);

  if (isSearchByAssetRequest(req)) {
    const { search_by_asset: amountAsset, match_exactly: matchExactly } = req;
    return q
      .with('assets_cte', (qb: knex.QueryBuilder) =>
        searchAssets(qb, amountAsset, getMatchExactly(matchExactly)[0])
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
      .toString();
  } else if (isSearchByAssetsRequest(req)) {
    const [amountAsset, priceAsset] = req.search_by_assets;

    const [amountAssetExactly, priceAssetExaclty] = getMatchExactly(
      req.match_exactly
    );

    return q
      .with('assets_cte', (qb: knex.QueryBuilder) =>
        qb
          .select({
            amount_asset_id: 't1.asset_id',
            price_asset_id: 't2.asset_id',
          })
          .from({
            t1: searchAssets(
              pg.queryBuilder(),
              amountAsset,
              amountAssetExactly,
              'a'
            ),
          })
          .crossJoin((qb: knex.QueryBuilder) =>
            searchAssets(qb, priceAsset, priceAssetExaclty, 'p').as('t2')
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
      .toString();
  } else {
    return q.toString();
  }
};
