const { renameKeys } = require('ramda-adjunct');
const { compose } = require('ramda');
const { Asset } = require('@waves/data-entities');

/** transformAssetInfo:: RawAssetInfo -> AssetInfo */
const transformAsset = compose(
  obj => new Asset(obj),
  renameKeys({
    asset_id: 'id',
    asset_name: 'name',
    issue_height: 'height',
    issue_timestamp: 'timestamp',
    total_quantity: 'quantity',
    decimals: 'precision',
    has_script: 'hasScript',
    min_sponsored_asset_fee: 'minSponsoredFee',
  })
);

module.exports = transformAsset;
