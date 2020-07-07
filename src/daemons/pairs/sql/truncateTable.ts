import * as knex from 'knex';
const pg = knex({ client: 'pg' });

export const truncateTable = (pairsTableName: string): string =>
  pg(pairsTableName)
    .truncate()
    .toString();
