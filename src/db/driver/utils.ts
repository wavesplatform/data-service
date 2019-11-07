import * as knex from 'knex';

const pg = knex({ client: 'pg' });

import { SqlQuery, PgDriver } from './';

const queryWithStatementTimeout = (
  statementTimeout: number,
  defaultStatementTimeout: number,
  query: string
): string =>
  [
    pg.raw('begin;set statement_timeout = ?;commit;', [statementTimeout]),
    query,
    pg.raw('begin;set statement_timeout = ?;commit;', [
      defaultStatementTimeout,
    ]),
  ].join(';');

export const withStatementTimeout = (
  pg: PgDriver,
  statementTimeout: number,
  defaultStatementTimeout: number
): PgDriver => {
  return {
    ...pg,
    none: (query: SqlQuery, values?: any) =>
      pg.none(
        queryWithStatementTimeout(
          statementTimeout,
          defaultStatementTimeout,
          query
        ),
        values
      ),
    one: (query: SqlQuery, values?: any) =>
      pg.one(
        queryWithStatementTimeout(
          statementTimeout,
          defaultStatementTimeout,
          query
        ),
        values
      ),
    oneOrNone: (query: SqlQuery, values?: any) =>
      pg.oneOrNone(
        queryWithStatementTimeout(
          statementTimeout,
          defaultStatementTimeout,
          query
        ),
        values
      ),
    many: (query: SqlQuery, values?: any) =>
      pg.many(
        queryWithStatementTimeout(
          statementTimeout,
          defaultStatementTimeout,
          query
        ),
        values
      ),
    any: (query: SqlQuery, values?: any) =>
      pg.any(
        queryWithStatementTimeout(
          statementTimeout,
          defaultStatementTimeout,
          query
        ),
        values
      ),
  };
};
