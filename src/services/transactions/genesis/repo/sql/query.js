const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_1' });

const selectFromFiltered = (filtered) =>
  filtered.select({
    uid: 't.uid',
    height: 't.height',
    tx_type: 't.tx_type',
    id: 't.id',
    time_stamp: 't.time_stamp',
    signature: 't.signature',
    proofs: 't.proofs',
    tx_version: 't.tx_version',
    fee: 't.fee',
    status: 't.status',
    recipient: pg.raw('coalesce(t.recipient_alias, t.recipient_address)'),
    amount: pg.raw('t.amount'),
  });

module.exports = { select, selectFromFiltered };
