const { compose, isNil, omit, zipWith, __, assoc, pipe } = require('ramda');
const { renameKeys } = require('ramda-adjunct');

const { transformTxInfo } = require('../_common/transformTxInfo');

/** addZippedTransfers ::
 * TxInfo -> TxInfoWithTransfers */
const addZippedTransfers = tx =>
  pipe(({ amounts, recipients }) => {
    if (
      isNil(amounts) ||
      !Array.isArray(amounts) ||
      isNil(recipients) ||
      !Array.isArray(recipients) ||
      // if there are not any recipients, recipients will be [null],
      // and amounts will be ['NaN']
      (recipients.length === 1 && recipients[0] === null)
    ) {
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
  }, assoc('transfers', __, tx))(tx);

module.exports = compose(
  transformTxInfo,
  renameKeys({
    asset_id: 'assetId',
    fee_asset: 'feeAsset',
  }),
  omit(['amounts', 'recipients']),
  addZippedTransfers
);
