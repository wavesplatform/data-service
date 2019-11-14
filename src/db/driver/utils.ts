import * as knex from 'knex';

const pg = knex({ client: 'pg' });

import { SqlQuery, PgDriver } from './';

const queryWithStatementTimeout = (
  query: string,
  statementTimeout: number
): string =>
  [
    pg.raw('begin'),
    pg.raw('set statement_timeout = ?', [statementTimeout]),
    pg.raw('commit'),
    query,
  ].join(';');

export const withStatementTimeout = (
  pg: PgDriver,
  statementTimeout: number
): PgDriver => {
  return {
    ...pg,
    none: (query: SqlQuery, values?: any) =>
      pg.none(queryWithStatementTimeout(query, statementTimeout), values),
    one: (query: SqlQuery, values?: any) =>
      pg.one(queryWithStatementTimeout(query, statementTimeout), values),
    oneOrNone: (query: SqlQuery, values?: any) =>
      pg.oneOrNone(queryWithStatementTimeout(query, statementTimeout), values),
    many: (query: SqlQuery, values?: any) =>
      pg.many(queryWithStatementTimeout(query, statementTimeout), values),
    any: (query: SqlQuery, values?: any) =>
      pg.any(queryWithStatementTimeout(query, statementTimeout), values),
  };
};

export const isStatementTimeoutErrorMessage = (message: string) =>
  message === 'canceling statement due to statement timeout';
