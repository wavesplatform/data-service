const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_14' }).select('*');

const selectFromFiltered = (filtered) =>
  pg({ t: filtered })
    .column({
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

      asset_id: 'a.asset_id',
      min_sponsored_asset_fee: pg.raw(
        't.min_sponsored_asset_fee * 10^(-a.decimals)'
      ),
    })
    .leftJoin('txs', 'txs.uid', 't.tx_uid')
    .leftJoin({ a: 'assets_data' }, 'a.uid', 't.asset_uid');

module.exports = { select, selectFromFiltered };
