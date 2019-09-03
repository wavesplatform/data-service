const pg = require('knex')({ client: 'pg' });
const { pipe } = require('ramda');

const selectIdsWhereRecipient = recipient =>
  pg('txs_11_transfers')
    .where('recipient', '=', recipient)
    .select('tx_id');

const select = pg('txs_11');
const renameToTxs = q => pg({ txs: q.clone() });

const withTransfers = q =>
  q.clone().join({ tfs: 'txs_11_transfers' }, 'tfs.tx_id', '=', 'txs.id');

const withDecimals = q =>
  q.clone().join({ ad: 'asset_decimals' }, 'ad.asset_id', '=', 'txs.asset_id');

const withGrouping = q =>
  q
    .clone()
    .groupBy(
      'txs.id',
      'fee',
      'height',
      'tx_type',
      'time_stamp',
      'signature',
      'proofs',
      'tx_version',
      'sender',
      'sender_public_key',
      'txs.asset_id',
      'attachment',
      'uid'
    );

const columns = {
  id: 'txs.id',
  fee: pg.raw('(fee * 10^(-8)) :: DOUBLE PRECISION'),
  recipients: pg.raw('array_agg(tfs.recipient order by tfs.position_in_tx)'),
  amounts: pg.raw(
    'array_agg (tfs.amount * 10^(-ad.decimals) :: double precision order by tfs.position_in_tx)'
  ),
  height: 'height',
  tx_type: 'tx_type',
  time_stamp: 'time_stamp',
  signature: 'signature',
  proofs: 'proofs',
  tx_version: 'tx_version',
  sender: 'sender',
  sender_public_key: 'sender_public_key',
  asset_id: 'txs.asset_id',
  attachment: 'attachment',
};

const withTransfersDecimalsAndGrouping = pipe(
  renameToTxs,
  withTransfers,
  withDecimals,
  withGrouping,
  q => q.select(columns)
);
module.exports = {
  select,
  withTransfersDecimalsAndGrouping,
  selectIdsWhereRecipient,
};
