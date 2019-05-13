import * as knex from 'knex';
import { compose } from 'ramda';
import { columns } from './common';
import { searchAssets } from './searchAssets';

const pg = knex({ client: 'pg' });

const getAssetIndex = (asset_id: string) =>
  pg('assets_cte')
    .column('rn')
    .where('asset_id', asset_id);

export const mget = (ids: number[]): string =>
  pg('assets')
    .select(columns)
    .whereIn('asset_id', ids)
    .toString();

export const get = (id: number): string => mget([id]);

export const search = ({
  ticker,
  search,
  after,
  limit,
}: {
  ticker: string;
  search: string;
  after: string;
  limit: number;
}): string => {
  const filter = (q: knex.QueryBuilder) => {
    if (ticker === '*') return q.whereNotNull('ticker');
    else return q.where('ticker', ticker);
  };

  if (typeof ticker !== 'undefined') {
    return compose(
      (q: knex.QueryBuilder) => q.toString(),
      filter
    )(pg('assets').select(columns));
  } else {
    return compose(
      (q: knex.QueryBuilder) => q.toString(),
      (q: knex.QueryBuilder) => (limit ? q.clone().limit(limit) : q),
      (q: knex.QueryBuilder) =>
        after ? q.clone().where('rn', '>', getAssetIndex(after)) : q
    )(searchAssets(search));
  }
};
