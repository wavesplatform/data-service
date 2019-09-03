const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_3' }).select('*');

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
      asset_id: 'am.asset_id',
      asset_name: 't.asset_name',
      description: 't.description',
      decimals: 't.decimals',
      quantity: pg.raw('t.quantity * 10^(-t.decimals)'),
      reissuable: 't.reissuable',
      script: 't.script',
    })
    .leftJoin({ txs: 'txs' }, 'txs.uid', 't.tuid')
    .leftJoin({ addrm: 'addresses_map' }, 'addrm.uid', 't.sender_uid')
    .leftJoin({ am: 'assets_map' }, 'am.uid', 't.asset_uid');

module.exports = { select, fSelect };
