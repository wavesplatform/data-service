import * as knex from 'knex';
const pg = knex({ client: 'pg' });

export const select = pg({ t: 'txs' }).select({
  tx_uid: 't.uid',
  tx_type: 't.tx_type',
  id: 't.id',
  time_stamp: 't.time_stamp',
  height: 't.height',
  position_in_block: 't.position_in_block',
});
