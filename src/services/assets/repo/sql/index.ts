import * as knex from 'knex';
import { compose, isNil } from 'ramda';
import { columns } from './common';
import { searchAssets } from './searchAssets';
import { AssetsSearchRequest, SearchByTicker } from '../types';

const pg = knex({ client: 'pg' });

const getAssetIndex = (asset_id: string) =>
  pg('assets_cte')
    .column('rn')
    .where('asset_id', asset_id);

export const mget = (ids: string[]): string =>
  pg('assets')
    .select(columns)
    .whereIn('asset_id', ids)
    .toString();

export const get = (id: string): string => mget([id]);

export const search = (req: AssetsSearchRequest): string => {
  const isSearchByTicker = (req: AssetsSearchRequest): req is SearchByTicker =>
    !isNil(req.ticker);

  if (isSearchByTicker(req)) {
    return compose(
      (q: knex.QueryBuilder) => q.toString(),
      (q: knex.QueryBuilder) => q.clone().limit(req.limit),
      (q: knex.QueryBuilder) =>
        req.ticker === '*'
          ? q.whereNotNull('ticker')
          : q.where('ticker', req.ticker)
    )(pg('assets').select(columns));
  } else {
    return compose(
      (q: knex.QueryBuilder) => q.toString(),
      (q: knex.QueryBuilder) => q.clone().limit(req.limit),
      (q: knex.QueryBuilder) =>
        req.after ? q.clone().where('rn', '>', getAssetIndex(req.after)) : q
    )(searchAssets(req.search));
  }
};
