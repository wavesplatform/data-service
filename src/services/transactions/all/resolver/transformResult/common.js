const { renameKeys } = require('ramda-adjunct');
const { compose, ifElse, propEq, omit } = require('ramda');

const hasEmptyProofs = propEq('proofs', []);
const processProofsAndSignature = ifElse(
  hasEmptyProofs,
  omit(['proofs']),
  omit(['signature'])
);

/** transformTxInfo:: RawTxInfo -> TxInfo */
const transformTxInfo = compose(
  processProofsAndSignature,
  renameKeys({
    tx_type: 'type',
    tx_version: 'version',
    sender_public_key: 'senderPublicKey',
    asset_id: 'assetId',
    fee_asset: 'feeAsset',
    time_stamp: 'timestamp',
    volume_waves: 'volumeWaves',
  })
);

module.exports = { transformTxInfo };
