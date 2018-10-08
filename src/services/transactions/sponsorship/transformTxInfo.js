const { compose } = require('ramda');
const { renameKeys } = require('ramda-adjunct');

const transformTxInfo = require('../_common/transformTxInfo');

module.exports = compose(
  renameKeys({
    min_sponsored_asset_fee: 'minSponsoredAssetFee',
    asset_id: 'assetId',
  }),
  transformTxInfo
);
