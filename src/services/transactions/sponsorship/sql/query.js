const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_14' })
  .select({
    height: 't.height',
    tx_type: 't.tx_type',
    id: 't.id',
    time_stamp: 't.time_stamp',
    signature: 't.signature',
    proofs: 't.proofs',
    tx_version: 't.tx_version',
    status: 't.status',
    fee: pg.raw('t.fee * 10^(-8)'),
    sender: 't.sender',
    sender_public_key: 't.sender_public_key',

    asset_id: 't.asset_id',
    min_sponsored_asset_fee: pg.raw(
      't.min_sponsored_asset_fee * 10^(-asset_decimals.decimals)'
    ),
  })
  .join('asset_decimals', 'asset_decimals.asset_id', '=', 't.asset_id');

module.exports = { select };
