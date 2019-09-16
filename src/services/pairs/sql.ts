import * as knex from 'knex';
import { compose } from 'ramda';
import { escapeForTsQuery, prepareForLike } from '../../utils/db';
import {
  PairsGetRequest,
  PairsMgetRequest,
  PairsSearchRequest,
  SearchByAssetRequest,
  SearchByAssetsRequest,
} from '.';
import { AssetIdsPair } from '../../types';

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

const isSearchByAssetRequest = (
  searchByAssetRequest: PairsSearchRequest
): searchByAssetRequest is SearchByAssetRequest => {
  return (
    typeof searchByAssetRequest === 'object' &&
    searchByAssetRequest !== null &&
    searchByAssetRequest.hasOwnProperty('search_by_asset')
  );
};

const isSearchByAssetsRequest = (
  searchByAssetRequest: PairsSearchRequest
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

const query = (pairs: AssetIdsPair[], matcher: string): string =>
  pg({ t: 'pairs' })
    .select(COLUMNS)
    .whereIn(
      ['t.amount_asset_id', 't.price_asset_id'],
      pairs.map(pair => [pair.amountAsset, pair.priceAsset])
    )
    .where('matcher', matcher)
    .toString();

const searchAssets = (
  qb: knex.QueryBuilder,
  query: string,
  matchExactly: boolean,
  tableAlias: string = 't'
) => {
  // will be used on searchable_asset_name search
  const cleanedQuery = escapeForTsQuery(query);
  return qb
    .table({ [tableAlias]: 'assets' })
    .column({ asset_id: `${tableAlias}.asset_id` })
    .where(`${tableAlias}.asset_id`, query)
    .orWhere(
      `${tableAlias}.ticker`,
      'ilike',
      prepareForLike(query, { matchExactly })
    )
    .unionAll(q =>
      q
        .from({ [`${tableAlias}2`]: 'assets_metadata' })
        .column({ asset_id: `${tableAlias}2.asset_id` })
        .where(
          `${tableAlias}2.asset_name`,
          'ilike',
          prepareForLike(query, { matchExactly })
        )
    )
    .unionAll(q =>
      compose((q: knex.QueryBuilder) =>
        cleanedQuery.length
          ? q.orWhereRaw(
              `${tableAlias}3.searchable_asset_name @@ to_tsquery(?)`,
              [`${cleanedQuery}:*`]
            )
          : q
      )(
        q
          .from({ [`${tableAlias}3`]: 'assets_names_map' })
          .column({ asset_id: `${tableAlias}3.asset_id` })
          .where(
            `${tableAlias}3.asset_name`,
            'ilike',
            prepareForLike(query, { matchExactly })
          )
      )
    );
};

export const get = (r: PairsGetRequest): string => query([r.pair], r.matcher);
export const mget = (r: PairsMgetRequest): string => query(r.pairs, r.matcher);
export const search = (req: PairsSearchRequest): string => {
  // asset - prefix search of amount or price assets
  // asset1/asset2 - prefix search of amount asset by asset1
  //                 and prefix search of price asset by asset2
  //                 or amount asset by asset2 and price asset by asset1

  const { matcher, limit } = req;
  const q = pg({ t: 'pairs' })
    .select(COLUMNS.map(column => `t.${column}`))
    .orderByRaw('volume_waves desc NULLS LAST')
    .where('matcher', matcher)
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
          .where('matcher', matcher)
      )
      .toString();
  } else {
    return q.toString();
  }
};
