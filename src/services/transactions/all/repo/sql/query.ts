import * as knex from 'knex';
const pg = knex({ client: 'pg' });

export const select = pg({ t: 'txs_all' }).select('uid');

export const selectFromFiltered = (filtered: knex.QueryBuilder) =>
  pg
    .with('ts', filtered)
    .select({
      uid: 't.uid',
      tx_type: 't.tx_type',
      id: 't.id',
      time_stamp: 't.time_stamp',
    })
    .from('ts')
    .join(
      { t: 'txs_all' },
      {
        't.uid': 'ts.uid',
      }
    );
