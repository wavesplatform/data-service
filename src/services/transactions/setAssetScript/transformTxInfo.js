const { compose } = require('ramda');
const { renameKeys } = require('ramda-adjunct');

const { transformTxInfo } = require('../_common/transformTxInfo');

module.exports = compose(
  transformTxInfo,
  renameKeys({
    asset_id: 'assetId',
  })
);
