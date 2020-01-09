const pg = require('knex')({ client: 'pg' });

const columns = {
  height: 't.height',
  tx_type: 't.tx_type',
  id: 't.id',
  time_stamp: 't.time_stamp',
  signature: 't.signature',
  proofs: 't.proofs',
  tx_version: 't.tx_version',
  fee: pg.raw('t.fee * 10^(-fd.fee_asset_decimals)'),
  sender: 't.sender',
  sender_public_key: 't.sender_public_key',
  asset_id: 't.asset_id',
  amount: pg.raw('t.amount * 10^(-ad.amount_asset_decimals)'),
  recipient: 't.recipient',
  fee_asset: 't.fee_asset',
  attachment: 't.attachment',
};

const decimals = alias =>
  pg('asset_decimals').select({
    [alias]: 'asset_decimals.decimals',
    asset_id: 'asset_decimals.asset_id',
  });

const withDecimals = q =>
  pg({ t: q.clone() })
    .join(
      { ad: decimals('amount_asset_decimals') },
      't.asset_id',
      '=',
      'ad.asset_id'
    )
    .join(
      { fd: decimals('fee_asset_decimals') },
      't.fee_asset',
      '=',
      'fd.asset_id'
    )
    .select(columns);

const select = pg({ t: 'txs_4' }).select([
  'height',
  'tx_type',
  'id',
  'time_stamp',
  'signature',
  'proofs',
  'tx_version',
  'fee',
  'sender',
  'sender_public_key',
  'asset_id',
  'amount',
  'recipient',
  'fee_asset',
  'attachment',
]);

module.exports = {
  select,
  withDecimals,
};
