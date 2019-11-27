const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_3' }).select('*');

const selectFromFiltered = filtered =>
  pg({ t: filtered })
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
      sender: 'addr.address',
      sender_public_key: 'addr.public_key',
      asset_id: 'a.asset_id',
      asset_name: 't.asset_name',
      description: 't.description',
      decimals: 't.decimals',
      quantity: pg.raw('t.quantity * 10^(-t.decimals)'),
      reissuable: 't.reissuable',
      script: 't.script',
    })
    .leftJoin({ txs: 'txs' }, 'txs.uid', 't.tx_uid')
    .leftJoin({ addr: 'addresses' }, 'addr.uid', 't.sender_uid')
    .leftJoin({ a: 'assets' }, 'a.uid', 't.asset_uid');

module.exports = { select, selectFromFiltered };
