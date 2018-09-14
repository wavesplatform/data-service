const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_9' }).select({
  height: 't.height',
  tx_type: 't.tx_type',
  id: 't.id',
  time_stamp: 't.time_stamp',
  signature: 't.signature',
  proofs: 't.proofs',
  tx_version: 't.tx_version',
  fee: pg.raw('t.fee * 10^(-8)'),
  sender: 't.sender',
  sender_public_key: 't.sender_public_key',
  lease_id: 't.lease_id',
});

module.exports = select;
