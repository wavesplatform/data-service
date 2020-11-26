const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_9' });

const selectFromFiltered = (filtered) =>
  filtered
    .select({
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
      sender: 't.sender',
      sender_public_key: 't.sender_public_key',
      lease_id: 'l.id',
    })
    .leftJoin({ l: 'txs_8' }, 'l.uid', 'lease_tx_uid');

module.exports = { select, selectFromFiltered };
