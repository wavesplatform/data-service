const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_9' });

const selectFromFiltered = (filtered) =>
  pg
    .select({
      tx_uid: 't.tx_uid',
      height: 't.height',
      tx_type: 'txs.tx_type',
      id: 'txs.id',
      time_stamp: 'txs.time_stamp',
      signature: 'txs.signature',
      proofs: 'txs.proofs',
      tx_version: 'txs.tx_version',
      fee: pg.raw('txs.fee * 10^(-8)'),
      sender: 't.sender',
      sender_public_key: 't.sender_public_key',
      lease_id: 't.lease_id',
    })
    .from({
      t: filtered
        .select({
          tx_uid: 't.tx_uid',
          height: 't.height',
          sender: 't.sender',
          sender_public_key: 't.sender_public_key',
          lease_id: 'l.id',
        })
        .leftJoin({ l: 'txs' }, 'l.uid', 't.lease_tx_uid'),
    })
    .leftJoin('txs', 'txs.uid', 't.tx_uid');

module.exports = { select, selectFromFiltered };
