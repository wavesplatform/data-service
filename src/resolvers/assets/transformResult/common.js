const { renameKeys } = require('ramda-adjunct');
const { compose, reject, isNil } = require('ramda');

/** transformAssetInfo:: RawAssetInfo -> AssetInfo */
const transformAssetInfo = compose(
  renameKeys({
    asset_id: 'id',
    asset_name: 'name',
    issue_height: 'height',
    issue_timestamp: 'timestamp',
    total_quantity: 'quantity',
    decimals: 'precision',
  }),
  reject(isNil)
);

module.exports = { transformAssetInfo };
