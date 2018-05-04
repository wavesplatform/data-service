const { renameKeys } = require('ramda-adjunct');
const { compose, reject, isNil, evolve } = require('ramda');
const { Asset } = require('@waves/data-entities');
const BigNumber = require('bignumber.js');

/** transformAssetInfo:: RawAssetInfo -> AssetInfo */
const transformAssetInfo = compose(
  obj => new Asset(obj),
  evolve({ quantity: q => new BigNumber(q) }),
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
