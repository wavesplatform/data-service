const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_8' }).select('*');

const fSelect = q =>
  pg({ t: q })
    .select({
      height: 't.height',
      tx_type: 't.tx_type',
      id: 'txs.id',
      time_stamp: 't.time_stamp',
      signature: 't.signature',
      proofs: 't.proofs',
      tx_version: 't.tx_version',
      fee: pg.raw('t.fee * 10^(-8)'),
      sender: 'addrm.address',
      sender_public_key: 'addrm.public_key',
      amount: pg.raw('t.amount * 10^(-8)'),
      recipient: pg.raw(
        'coalesce(recipient_alias.alias, recipient_addrm.address)'
      ),
    })
    .leftJoin({ txs: 'txs' }, 'txs.uid', 't.tuid')
    .leftJoin({ addrm: 'addresses_map' }, 'addrm.uid', 't.sender_uid')
    .leftJoin(
      { recipient_addrm: 'addresses_map' },
      'recipient_addrm.uid',
      't.recipient_uid'
    )
    .leftJoin(
      { recipient_alias: 'txs_10' },
      'recipient_alias.tuid',
      't.recipient_alias_uid'
    );

module.exports = { select, fSelect };
