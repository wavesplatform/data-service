const { compose } = require('ramda');
const { renameKeys } = require('ramda-adjunct');

const transformTxInfo = require('../common/transformTxInfo');

module.exports = compose(
  renameKeys({
    asset_id: 'assetId',
  }),
  transformTxInfo
);
