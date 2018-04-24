const { renameKeys } = require('ramda-adjunct');
const { compose, reject, isNil, cond, T, identity } = require('ramda');

/**
 * transform raw data if necessary
 * transformAssetInfo:: RawAssetInfo | null -> AssetInfo | null
 * */
const transformAssetInfo = cond([
  [isNil, identity],
  [
    T,
    compose(
      renameKeys({
        asset_id: 'id',
        asset_name: 'name',
        issue_height: 'height',
        issue_timestamp: 'timestamp',
        total_quantity: 'quantity',
        decimals: 'precision',
      }),
      reject(isNil)
    ),
  ],
]);

module.exports = { transformAssetInfo };
