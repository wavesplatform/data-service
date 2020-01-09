const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_1' }).select({
  height: 't.height',
  tx_type: 't.tx_type',
  id: 't.id',
  time_stamp: 't.time_stamp',
  signature: 't.signature',
  proofs: 't.proofs',
  tx_version: 't.tx_version',
  fee: 't.fee',
  recipient: 't.recipient',
  amount: pg.raw('t.amount * 10^(-8)'),
});

module.exports = { select };
