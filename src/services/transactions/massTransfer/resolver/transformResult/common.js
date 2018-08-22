const { renameKeys } = require('ramda-adjunct');
const {
  compose,
  ifElse,
  propEq,
  omit,
  zipWith,
  __,
  assoc,
  pipe,
} = require('ramda');

const hasEmptyProofs = propEq('proofs', []);
const processProofsAndSignature = ifElse(
  hasEmptyProofs,
  omit(['proofs']),
  omit(['signature'])
);

/** addZippedTransfers ::
 * TxInfo -> TxInfoWithTransfers */
const addZippedTransfers = tx =>
  pipe(
    ({ amounts, recipients }) => {
      if (!amounts || !recipients) {
        return [];
      }
      return zipWith(
        (amount, recipient) => ({
          amount,
          recipient,
        }),
        amounts,
        recipients
      );
    },
    assoc('transfers', __, tx)
  )(tx);

/** transformTxInfo:: RawTxInfo -> TxInfo */
const transformTxInfo = compose(
  omit(['amounts', 'recipients']),
  addZippedTransfers,
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
