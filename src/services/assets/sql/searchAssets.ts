import * as knex from 'knex';
import { compose, map } from 'ramda';
import { escapeForTsQuery, prepareForLike } from '../../../utils/db';
import { columns } from './common';

const pg = knex({ client: 'pg' });

const searchById = (q: string) =>
  pg({ a: 'assets' })
    .columns({
      asset_uid: `a.${columns.uid}`,
      asset_name: `a.${columns.asset_name}`,
      ticker: `a.${columns.ticker}`,
      height: pg.raw(`coalesce(a.first_appeared_on_height, 0)`),
      rank: pg.raw(
        `ts_rank(to_tsvector('simple', a.${columns.asset_id}), plainto_tsquery(?), 3) * case when a.${columns.ticker} is null then 128 else 256 end`,
        [q]
      ),
    })
    .where(
      `a.${columns.asset_id}`,
      'ilike',
      prepareForLike(q, { matchExactly: true })
    ); // ilike - hack for searching for waves in different cases

const searchByNameInMeta = (qb: knex.QueryBuilder, q: string) =>
  qb
    .table('assets_metadata')
    .columns([
      'asset_uid',
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
      asset_uid: `a.${columns.uid}`,
      asset_name: `a.${columns.asset_name}`,
      ticker: `a.${columns.ticker}`,
      height: pg.raw(`coalesce(a.first_appeared_on_height, 0)`),
      rank: pg.raw('32'),
    })
    .where(`a.${columns.ticker}`, 'ilike', prepareForLike(q));

const searchByName = (qb: knex.QueryBuilder, q: string) => {
  const cleanedQuery = escapeForTsQuery(q);
  return compose((q: knex.QueryBuilder) =>
    cleanedQuery.length
      ? q.orWhereRaw('a.searchable_asset_name @@ to_tsquery(?)', [
          `${cleanedQuery}:*`,
        ])
      : q
  )(
    qb
      .table({ a: 'assets' })
      .columns({
        asset_uid: `a.${columns.uid}`,
        asset_name: `a.${columns.asset_name}`,
        ticker: `a.${columns.ticker}`,
        height: pg.raw(`coalesce(a.first_appeared_on_height, 0)`),
        rank: pg.raw(
          `ts_rank(to_tsvector('simple', a.${columns.asset_name}), plainto_tsquery(?), 3) * case when a.${columns.ticker} is null then 16 else 32 end`,
          [q]
        ),
      })
      .where(`a.${columns.asset_name}`, 'ilike', prepareForLike(q))
  );
};

export const searchAssets = (query: string): knex.QueryBuilder =>
  pg
    .with('assets_cte', qb => {
      qb.select([
        pg.raw('distinct on ("r"."asset_uid") "r"."asset_uid"'),
        'r.ticker',
        'r.asset_name',
        {
          rn: pg.raw(
            'row_number() over (order by r.rank desc, r.height asc, r.asset_uid asc)'
          ),
        },
      ])
        .from({
          r: searchById(query)
            .unionAll(qb => searchByNameInMeta(qb, query))
            .unionAll(qb => searchByTicker(qb, query))
            .unionAll(qb => searchByName(qb, query)),
        })
        .orderBy('r.asset_uid')
        .orderBy('r.rank', 'desc');
    })
    .from('assets_cte')
    .select(map(col => `a.${col}`, columns))
    .innerJoin({ a: 'assets' }, 'assets_cte.asset_uid', 'a.uid')
    .orderBy('rn', 'asc');
