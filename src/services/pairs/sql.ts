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
    .select({
      amount_asset_id: 'aa.asset_id',
      price_asset_id: 'pa.asset_id',
    })
    .join({ aa: 'assets' }, 'aa.uid', 't.amount_asset_uid')
    .join({ pa: 'assets' }, 'pa.uid', 't.price_asset_uid')
    .leftJoin(
      { matcher_addr: 'addresses' },
      'matcher_addr.uid',
      't.matcher_address_uid'
    )
    .whereIn(
      ['aa.asset_id', 'pa.asset_id'],
      pairs.map(pair => [pair.amountAsset, pair.priceAsset])
    )
    .whereIn('matcher_address_uid', function() {
      this.select('uid')
        .from('addresses')
        .where('address', matcher)
        .limit(1);
    })
    .toString();

const searchAssets = (
  qb: knex.QueryBuilder,
  query: string,
  matchExactly: boolean,
  tableAlias: string = 't'
) => {
  // will be used on searchable_asset_name search
  const cleanedQuery = escapeForTsQuery(query);
  return qb.distinct('asset_uid').from(function(this: knex.QueryBuilder) {
    this.table({ [tableAlias]: 'assets' })
      .column({ asset_uid: `${tableAlias}.uid` })
      .where(`${tableAlias}.asset_id`, query)
      .orWhere(
        `${tableAlias}.ticker`,
        'ilike',
        prepareForLike(query, { matchExactly })
      )
      .unionAll(q =>
        q
          .from({ [`${tableAlias}2`]: 'assets_metadata' })
          .column({ asset_uid: `${tableAlias}2.asset_uid` })
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
            .from({ [`${tableAlias}3`]: 'assets' })
            .column({ asset_uid: `${tableAlias}3.uid` })
            .where(
              `${tableAlias}3.asset_name`,
              'ilike',
              prepareForLike(query, { matchExactly })
            )
        )
      )
      .as('a');
  });
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
    .select({
      amount_asset_id: 'aa.asset_id',
      price_asset_id: 'pa.asset_id',
    })
    .join({ aa: 'assets' }, 'aa.uid', 't.amount_asset_uid')
    .join({ pa: 'assets' }, 'pa.uid', 't.price_asset_uid')
    .orderByRaw('volume_waves desc NULLS LAST')
    .whereIn('matcher_address_uid', function() {
      this.select('uid')
        .from('addresses')
        .where('address', matcher)
        .limit(1);
    })
    .limit(limit);

  if (isSearchByAssetRequest(req)) {
    const { search_by_asset: amountAsset, match_exactly: matchExactly } = req;
    return q
      .with('assets_cte', (qb: knex.QueryBuilder) =>
        searchAssets(qb, amountAsset, getMatchExactly(matchExactly)[0])
      )
      .join(
        { amountCte: 'assets_cte' },
        'amountCte.asset_uid',
        't.amount_asset_uid'
      )
      .join(
        { priceCte: 'assets_cte' },
        'priceCte.asset_uid',
        't.amount_asset_uid'
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
            amount_asset_uid: 't1.asset_uid',
            price_asset_uid: 't2.asset_uid',
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
      .join(
        { direct_cte: 'assets_cte' },
        {
          'direct_cte.amount_asset_uid': 't.amount_asset_uid',
          'direct_cte.price_asset_uid': 't.price_asset_uid',
        }
      )
      .unionAll((qb: knex.QueryBuilder) =>
        qb
          .select(COLUMNS.map(column => `t1.${column}`))
          .select({
            amount_asset_id: 'aa.asset_id',
            price_asset_id: 'pa.asset_id',
          })
          .from({ t1: 'pairs' })
          .join(
            { reverse_cte: 'assets_cte' },
            {
              'reverse_cte.amount_asset_uid': 't1.price_asset_uid',
              'reverse_cte.price_asset_uid': 't1.amount_asset_uid',
            }
          )
          .join({ aa: 'assets' }, 'aa.uid', 't1.amount_asset_uid')
          .join({ pa: 'assets' }, 'pa.uid', 't1.price_asset_uid')
          .whereIn('matcher_address_uid', function() {
            this.select('uid')
              .from('addresses')
              .where('address', matcher)
              .limit(1);
          })
      )
      .toString();
  } else {
    return q.toString();
  }
};
