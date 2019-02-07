import * as knex from 'knex';
const pg = knex({ client: 'pg' });

export const truncateTable = (tableName: string): string =>
  pg(tableName)
    .truncate()
    .toString();
