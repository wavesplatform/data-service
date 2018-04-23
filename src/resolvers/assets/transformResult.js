const { Asset, List } = require('../../types');

const { renameKeys } = require('ramda-adjunct');
const { compose, map, reject, isNil, cond, T, identity } = require('ramda');

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

/**
 * apply types to transformed data
 * transformResults :: (RawAssetInfo | null)[] -> List Asset
 */
module.exports = compose(List, map(Asset), map(transformAssetInfo));
