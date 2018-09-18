const { compose, omit, zipWith, __, assoc, pipe } = require('ramda');
const { renameKeys } = require('ramda-adjunct');

const transformTxInfo = require('../common/transformTxInfo');

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

module.exports = compose(
  renameKeys({
    asset_id: 'assetId',
    fee_asset: 'feeAsset',
  }),
  omit(['amounts', 'recipients']),
  addZippedTransfers,
  transformTxInfo
);
