const { compose } = require('ramda');
const { renameKeys } = require('ramda-adjunct');

const { transformTxInfo } = require('../_common/transformTxInfo');

module.exports = compose(
  transformTxInfo,
  renameKeys({
    min_sponsored_asset_fee: 'minSponsoredAssetFee',
    asset_id: 'assetId',
  })
);
