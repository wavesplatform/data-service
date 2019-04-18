import * as knex from 'knex';
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
        `ts_rank(to_tsvector('simple', t.asset_id), to_tsquery('${q
          .split(' ')
          .join(
            ' & '
          )}:*'), 3) * case when t.ticker is null then 128 else 256 end`
      ),
    })
    .where('t.asset_id', q);

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
          `ts_rank(to_tsvector('simple', asset_name), to_tsquery('${q}:*'), 3) * case when ticker is null then 64 else 128 end`
        ),
      },
    ])
    .where('asset_name', 'ilike', `${q}%`);

const searchByTicker = (qb: knex.QueryBuilder, q: string) =>
  qb
    .table({ ti: 'tickers' })
    .columns({
      asset_id: 'ti.asset_id',
      asset_name: 't.asset_name',
      ticker: 'ti.ticker',
      height: 't.height',
      rank: pg.raw(
        `ts_rank(to_tsvector('simple', ti.ticker), to_tsquery('${q
          .split(' ')
          .join(' & ')}:*'), 3) * 32`
      ),
    })
    .leftJoin({ t: 'txs_3' }, 'ti.asset_id', 't.asset_id')
    .where('ticker', 'like', `${q}%`);

const searchByName = (qb: knex.QueryBuilder, q: string) =>
  qb
    .table({ t: 'assets' })
    .columns({
      asset_id: 't.asset_id',
      asset_name: 't.asset_name',
      ticker: 't.ticker',
      height: 't.issue_height',
      rank: pg.raw(
        `ts_rank(to_tsvector('simple', t.asset_name), to_tsquery('${q
          .split(' ')
          .join(
            ' & '
          )}:*'), 3) * case when t.ticker is null then 16 else 32 end`
      ),
    })
    .whereRaw(
      `to_tsvector('simple', t.asset_name) @@ to_tsquery('${q
        .split(' ')
        .join(' & ')}:*')`
    )
    .orWhere('t.asset_name', 'ilike', `${q}%`);

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
        .orderBy('r.asset_id');
    })
    .from('assets_cte')
    .select(columns.map(col => 'a.' + col))
    .innerJoin({ a: 'assets' }, 'assets_cte.asset_id', 'a.asset_id')
    .orderBy('rn', 'asc');
