const { renameKeys } = require('ramda-adjunct');
const { compose, reject, isNil } = require('ramda');
const { Asset } = require('@waves/data-entities');

/** transformAssetInfo:: RawAssetInfo -> AssetInfo */
const transformAssetInfo = compose(
  obj => new Asset(obj),
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
