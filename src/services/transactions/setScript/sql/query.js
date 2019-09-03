const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_13' }).select('*');

const fSelect = q =>
  pg({ t: q })
    .select({
      // common
      height: 't.height',
      tx_type: 't.tx_type',
      id: 'txs.id',
      time_stamp: 't.time_stamp',
      signature: 't.signature',
      proofs: 't.proofs',
      tx_version: 't.tx_version',
      fee: pg.raw('fee * 10^(-8)'),
      sender: 'addrm.address',
      sender_public_key: 'addrm.public_key',

      // type-specific
      script: 't.script',
    })
    .leftJoin('txs', 'txs.uid', 't.tuid')
    .leftJoin({ addrm: 'addresses_map' }, 'addrm.uid', 't.sender_uid');

module.exports = { select, fSelect };
