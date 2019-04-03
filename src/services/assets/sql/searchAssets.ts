import * as knex from 'knex';
import { columns } from './common';

const pg = knex({ client: 'pg' });

const searchById = (q: string) =>
  pg({ t: 'txs_3' })
    .columns({
      asset_id: 't.asset_id',
      asset_name: 't.asset_name',
      ticker: 'ti.ticker',
      height: 't.height',
      rank: pg.raw(
        `ts_rank(to_tsvector('simple', t.asset_id), to_tsquery('${q
          .split(' ')
          .join(
            ' & '
          )}:*'), 3) * case when ti.ticker is null then 128 else 256 end`
      ),
    })
    .leftJoin({ ti: 'tickers' }, 't.asset_id', 'ti.asset_id')
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
    .where('asset_name', 'like', `${q}%`);

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
    .table({ t: 'txs_3' })
    .columns({
      asset_id: 't.asset_id',
      asset_name: 't.asset_name',
      ticker: 'ti.ticker',
      height: 't.height',
      rank: pg.raw(
        `ts_rank(searchable_asset_name, to_tsquery('${q
          .split(' ')
          .join(
            ' & '
          )}:*'), 3) * case when ti.ticker is null then 16 else 32 end`
      ),
    })
    .leftJoin({ ti: 'tickers' }, 't.asset_id', 'ti.asset_id')
    .whereRaw(
      `searchable_asset_name @@ to_tsquery('${q.split(' ').join(' & ')}:*')`
    );

export const searchAssets = (query: string): knex.QueryBuilder =>
  pg
    .with('assets_cte', qb => {
      qb.columns([
        'asset_id',
        'ticker',
        'asset_name',
        {
          rn: pg.raw(
            'row_number() over (order by r.rank desc, r.height asc, r.asset_id asc)'
          ),
        },
      ]).from({
        r: searchById(query)
          .unionAll(qb => searchByNameInMeta(qb, query))
          .unionAll(qb => searchByTicker(qb, query))
          .unionAll(qb => searchByName(qb, query)),
      });
    })
    .from('assets_cte')
    .select(columns.map(col => 'a.' + col))
    .innerJoin({ a: 'assets' }, 'assets_cte.asset_id', 'a.asset_id')
    .orderBy('rn', 'asc');
