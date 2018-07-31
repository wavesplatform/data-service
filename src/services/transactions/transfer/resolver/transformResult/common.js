const { renameKeys } = require('ramda-adjunct');
const { compose } = require('ramda');

/** transformTxInfo:: RawTxInfo -> TxInfo */
const transformTxInfo = compose(
  renameKeys({
    tx_type: 'type',
    tx_version: 'txVersion',
    sender_public_key: 'senderPublicKey',
    asset_id: 'assetId',
    fee_asset: 'feeAsset',
    time_stamp: 'timestamp',
    volume_waves: 'volumeWaves',
  })
);

module.exports = { transformTxInfo };
