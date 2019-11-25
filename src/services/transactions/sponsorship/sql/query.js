const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_14' }).select('*');

const selectOnFiltered = filtered =>
  pg({ t: filtered })
    .column({
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
      min_sponsored_asset_fee: pg.raw(
        't.min_sponsored_asset_fee * 10^(-dec.decimals)'
      ),
    })
    .leftJoin('txs', 'txs.uid', 't.tx_uid')
    .leftJoin({ addr: 'addresses' }, 'addr.uid', 't.sender_uid')
    .leftJoin({ a: 'assets' }, 'a.uid', 't.asset_uid')
    .leftJoin({ dec: 'txs_3' }, 'dec.asset_uid', '=', 't.asset_uid');

module.exports = { select, selectOnFiltered };
