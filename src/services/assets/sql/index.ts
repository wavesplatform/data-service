import * as knex from 'knex';
import { complement, compose, ifElse, isNil, map } from 'ramda';
import { columns } from './common';
import { searchAssets } from './searchAssets';

const pg = knex({ client: 'pg' });

/*
 * coalesce(a.first_appeared_on_height, 0) is used because of first_appeared_on_height for WAVES is null
 * coalesce(addr.address, '') is used for the same reason
 */

const getAssetIndex = (asset_id: string) =>
  pg('assets_cte')
    .column('rn')
    .where('asset_id', asset_id);

export const mget = (ids: string[]): string =>
  pg({ a: 'assets' })
    .select(map(col => `a.${col}`, columns))
    .select({
      issue_height: pg.raw('coalesce(a.first_appeared_on_height, 0)'),
      sender: pg.raw(`coalesce(addr.address, '')`),
    })
    .whereIn('asset_id', ids)
    .leftJoin({ t: 'txs_3' }, 't.asset_uid', 'a.uid')
    .leftJoin({ addr: 'addresses' }, 'addr.uid', 't.sender_uid')
    .toString();

export const get = (id: string): string => mget([id]);

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
  const filter = (ticker: string) => (q: knex.QueryBuilder) => {
    if (ticker === '*') return q.whereNotNull('ticker');
    else return q.where('ticker', ticker);
  };

  return compose(
    (q: knex.QueryBuilder) => q.toString(),
    (q: knex.QueryBuilder) =>
      q
        .select({
          issue_height: pg.raw('coalesce(a.first_appeared_on_height, 0)'),
          sender: pg.raw(`coalesce(addr.address, '')`),
        })
        .leftJoin({ t: 'txs_3' }, 't.asset_uid', 'a.uid')
        .leftJoin({ addr: 'addresses' }, 'addr.uid', 't.sender_uid'),
    ifElse(
      complement(isNil),
      ticker => compose(filter(ticker))(pg({ a: 'assets' }).select(columns)),
      () =>
        compose(
          (q: knex.QueryBuilder) => (limit ? q.clone().limit(limit) : q),
          (q: knex.QueryBuilder) =>
            after ? q.clone().where('rn', '>', getAssetIndex(after)) : q
        )(searchAssets(search))
    )
  )(ticker);
};
