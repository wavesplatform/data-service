import * as knex from 'knex';

const pg = knex({ client: 'pg' });

import { SqlQuery, PgDriver } from './';

const queryWithStatementTimeout = (
  query: string,
  statementTimeout: number,
  defaultStatementTimeout: number
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
          query,
          statementTimeout,
          defaultStatementTimeout
        ),
        values
      ),
    one: (query: SqlQuery, values?: any) =>
      pg.one(
        queryWithStatementTimeout(
          query,
          statementTimeout,
          defaultStatementTimeout
        ),
        values
      ),
    oneOrNone: (query: SqlQuery, values?: any) =>
      pg.oneOrNone(
        queryWithStatementTimeout(
          query,
          statementTimeout,
          defaultStatementTimeout
        ),
        values
      ),
    many: (query: SqlQuery, values?: any) =>
      pg.many(
        queryWithStatementTimeout(
          query,
          statementTimeout,
          defaultStatementTimeout
        ),
        values
      ),
    any: (query: SqlQuery, values?: any) =>
      pg.any(
        queryWithStatementTimeout(
          query,
          statementTimeout,
          defaultStatementTimeout
        ),
        values
      ),
  };
};

export const isStatementTimeoutErrorMessage = (message: string) =>
  message === 'canceling statement due to statement timeout';
