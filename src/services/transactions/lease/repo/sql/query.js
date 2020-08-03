const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_8' });

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
      amount: 't.amount',
      recipient: 't.recipient',
    })
    .from({
      t: pg({
        t: filtered.select({
          tx_uid: 't.tx_uid',
          sender: 't.sender',
          sender_public_key: 't.sender_public_key',
          height: 't.height',
          amount: pg.raw('t.amount * 10^(-8)'),
          recipient: pg.raw('coalesce(t.recipient_alias, t.recipient_address)'),
        }),
      }),
    })
    .leftJoin({ txs: 'txs' }, 'txs.uid', 't.tx_uid');

module.exports = { select, selectFromFiltered };
