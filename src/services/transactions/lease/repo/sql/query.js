const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_8' });

const selectFromFiltered = filtered =>
  pg
    .select({
      tx_uid: 't.tx_uid',
      height: 't.height',
      position_in_block: 't.position_in_block',
      tx_type: 'txs.tx_type',
      id: 'txs.id',
      time_stamp: 'txs.time_stamp',
      signature: 'txs.signature',
      proofs: 'txs.proofs',
      tx_version: 'txs.tx_version',
      fee: pg.raw('txs.fee * 10^(-8)'),
      sender: 'addr.address',
      sender_public_key: 'addr.public_key',
      amount: 't.amount',
      recipient: pg.raw('coalesce(t.recipient_alias, t.recipient_address)'),
    })
    .from({
      t: pg({
        t: filtered
          .select({
            tx_uid: 't.tx_uid',
            sender_uid: 't.sender_uid',
            height: 't.height',
            position_in_block: 't.position_in_block',
            recipient_address_uid: 't.recipient_address_uid',
            amount: pg.raw('t.amount * 10^(-8)'),
            recipient_alias: 'recipient_alias.alias',
          })
          .leftJoin(
            { recipient_alias: 'txs_10' },
            'recipient_alias.tx_uid',
            't.recipient_alias_uid'
          ),
      })
        .select('*')
        .select({
          recipient_address: 'recipient_addr.address',
        })
        .leftJoin(
          { recipient_addr: 'addresses' },
          'recipient_addr.uid',
          't.recipient_address_uid'
        ),
    })
    .leftJoin({ txs: 'txs' }, 'txs.uid', 't.tx_uid')
    .leftJoin({ addr: 'addresses' }, 'addr.uid', 't.sender_uid');

module.exports = { select, selectFromFiltered };
