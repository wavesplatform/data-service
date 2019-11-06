import * as knex from 'knex';

const pg = knex({ client: 'pg' });

export const withStatementTimeout = (
  statementTimeout: number,
  sql: string
): string =>
  [pg.raw('begin;set statement_timeout = ?;commit;', [statementTimeout]), sql].join(';');
