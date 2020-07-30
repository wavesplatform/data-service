const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_17' }).select({
  height: 't.height',
  tx_type: 't.tx_type',
  id: 't.id',
  time_stamp: 't.time_stamp',
  signature: 't.signature',
  proofs: 't.proofs',
  tx_version: 't.tx_version',
  status: 't.status',
  fee: pg.raw('t.fee * 10^(-8)'),
  sender: 't.sender',
  sender_public_key: 't.sender_public_key',
  asset_id: 't.asset_id',
  asset_name: 't.asset_name',
  description: 't.description',
});

module.exports = { select };
