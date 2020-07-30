const pg = require('knex')({ client: 'pg' });

const select = pg({ t: 'txs_6' })
  .select({
    height: 't.height',
    tx_type: 't.tx_type',
    id: 't.id',
    time_stamp: 't.time_stamp',
    signature: 't.signature',
    proofs: 't.proofs',
    tx_version: 't.tx_version',
    fee: pg.raw('t.fee * 10^(-8)'),
    status: 't.status',
    sender: 't.sender',
    sender_public_key: 't.sender_public_key',

    asset_id: 't.asset_id',
    amount: pg.raw('t.amount * 10^(-asset_decimals.decimals)'),
  })
  .join('asset_decimals', 'asset_decimals.asset_id', '=', 't.asset_id');

module.exports = { select };
