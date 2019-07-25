const { compose } = require('ramda');
const { renameKeys } = require('ramda-adjunct');

const { transformTxInfo } = require('../_common/transformTxInfo');

module.exports = compose(
  transformTxInfo,
  renameKeys({
    fee_asset: 'feeAsset',
    asset_id: 'assetId',
  })
);
