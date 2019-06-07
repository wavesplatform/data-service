import * as knex from 'knex';
import { compose } from 'ramda';
import { escapeForTsQuery, prepareForLike } from '../../../utils/db';
import { columns } from './common';

const pg = knex({ client: 'pg' });

const searchById = (q: string) =>
  pg({ t: 'assets' })
    .columns({
      asset_id: 't.asset_id',
      asset_name: 't.asset_name',
      ticker: 't.ticker',
      height: 't.issue_height',
      rank: pg.raw(
        "ts_rank(to_tsvector('simple', t.asset_id), plainto_tsquery(?), 3) * case when t.ticker is null then 128 else 256 end",
        [q]
      ),
    })
    .where('t.asset_id', 'ilike', prepareForLike(q, { matchExactly: true })); // ilike - hack for searching for waves in different cases

const searchByNameInMeta = (qb: knex.QueryBuilder, q: string) =>
  qb
    .table('assets_metadata')
    .columns([
      'asset_id',
      'asset_name',
      'ticker',
      'height',
      {
        rank: pg.raw(
          "ts_rank(to_tsvector('simple', asset_name), plainto_tsquery(?), 3) * case when ticker is null then 64 else 128 end",
          [q]
        ),
      },
    ])
    .where('asset_name', 'ilike', prepareForLike(q));

const searchByTicker = (qb: knex.QueryBuilder, q: string): knex.QueryBuilder =>
  qb
    .table({ a: 'assets' })
    .columns({
      asset_id: 'a.asset_id',
      asset_name: 'a.asset_name',
      ticker: 'a.ticker',
      height: 'a.issue_height',
      rank: pg.raw('32'),
    })
    .where('a.ticker', 'ilike', prepareForLike(q));

const searchByName = (qb: knex.QueryBuilder, q: string) => {
  const cleanedQuery = escapeForTsQuery(q);
  return compose((q: knex.QueryBuilder) =>
    cleanedQuery.length
      ? q.whereRaw('am.searchable_asset_name @@ to_tsquery(?)', [
          `${cleanedQuery}:*`,
        ])
      : q
  )(
    qb
      .table({ am: 'assets_names_map' })
      .columns({
        asset_id: 'am.asset_id',
        asset_name: 'am.asset_name',
        ticker: 'ti.ticker',
        height: 't.height',
        rank: pg.raw(
          "ts_rank(to_tsvector('simple', am.asset_name), plainto_tsquery(?), 3) * case when ti.ticker is null then 16 else 32 end",
          [q]
        ),
      })
      .leftJoin({ t: 'txs_3' }, 'am.asset_id', 't.asset_id')
      .leftJoin({ ti: 'tickers' }, 'am.asset_id', 'ti.asset_id')
      .where('am.asset_name', 'ilike', prepareForLike(q))
  );
};

export const searchAssets = (query: string): knex.QueryBuilder =>
  pg
    .with('assets_cte', qb => {
      qb.select([
        pg.raw('distinct on ("r"."asset_id") "r"."asset_id"'),
        'r.ticker',
        'r.asset_name',
        {
          rn: pg.raw(
            'row_number() over (order by r.rank desc, r.height asc, r.asset_id asc)'
          ),
        },
      ])
        .from({
          r: searchById(query)
            .unionAll(qb => searchByNameInMeta(qb, query))
            .unionAll(qb => searchByTicker(qb, query))
            .unionAll(qb => searchByName(qb, query)),
        })
        .orderBy('r.asset_id')
        .orderBy('r.rank', 'desc');
    })
    .from('assets_cte')
    .select(columns.map(col => 'a.' + col))
    .innerJoin({ a: 'assets' }, 'assets_cte.asset_id', 'a.asset_id')
    .orderBy('rn', 'asc');
