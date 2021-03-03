import * as knex from 'knex';
import { compose } from 'ramda';
import { columns } from './common';

const pg = knex({ client: 'pg' });

const baseQuery = pg
  .from('assets')
  .select(columns)
  .column({
    rn: pg.raw(
      'row_number() over (order by ticker asc, issue_height desc, asset_id asc)'
    ),
  })
  .orderBy('ticker', 'asc')
  .orderBy('issue_height', 'desc')
  .orderBy('asset_id', 'asc');

export const searchAssetsByTicker = (ticker: string): knex.QueryBuilder =>
  compose(
    (q: knex.QueryBuilder) =>
      pg.with('assets_cte', q).from('assets_cte').select(columns).orderBy('rn', 'asc'),
    (q: knex.QueryBuilder) =>
      ticker === '*' ? q.whereNotNull('ticker') : q.where('ticker', ticker)
  )(baseQuery);
