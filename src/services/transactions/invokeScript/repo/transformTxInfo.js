const { compose, isNil, reject } = require('ramda');
const { renameKeys } = require('ramda-adjunct');
const { transformTxInfo } = require('../../_common/transformTxInfo');

module.exports = compose(
  transformTxInfo,
  renameKeys({
    fee_asset_id: 'feeAssetId',
    dapp: 'dApp',
  }),
  reject(isNil)
);
