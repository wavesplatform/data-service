import * as knex from 'knex';
import { complement, compose, cond, isNil, map } from 'ramda';
import { columns } from './common';
import { searchAssets } from './searchAssets';
import { AssetsSearchRequest } from '../types';

const pg = knex({ client: 'pg' });

const getAssetIndex = (asset_id: string) =>
  pg('assets_cte').column('rn').where('asset_id', asset_id);

export const mget = (ids: string[]): string =>
  pg({ a: 'assets' })
    .select(map((col) => `a.${col}`, columns))
    .select({
      issue_height: pg.raw('a.issue_height'),
      sender: pg.raw(`a.sender`),
    })
    .whereIn('asset_id', ids)
    .toString();

export const get = (id: string): string => mget([id]);

export const search = (request: AssetsSearchRequest): string => {
  const filter = (ticker: string) => (q: knex.QueryBuilder) => {
    if (ticker === '*') return q.whereNotNull('ticker').andWhere('ticker', '<>', '');
    else return q.where('ticker', ticker);
  };

  return compose(
    (q: knex.QueryBuilder) => q.toString(),
    (q: knex.QueryBuilder) =>
      q.select({
        issue_height: pg.raw('a.issue_height'),
        sender: pg.raw(`a.sender`),
      }),
    (request: AssetsSearchRequest) =>
      cond([
        [
          (request) => isNil(request.ticker),
          (request) =>
            compose(
              (q: knex.QueryBuilder) =>
                request.limit ? q.clone().limit(request.limit) : q,
              (q: knex.QueryBuilder) =>
                request.after
                  ? q.clone().where('rn', '>', getAssetIndex(request.after))
                  : q
            )(searchAssets(request.search)),
        ],
        [
          complement(isNil),
          (request) =>
            compose(filter(request.ticker))(
              pg({ a: 'assets' }).select(map((col) => `a.${col}`, columns))
            ),
        ],
      ])(request)
  )(request);
};
