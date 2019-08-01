const { compose, reject, isNil } = require('ramda');

const { transformTxInfo } = require('../_common/transformTxInfo');

module.exports = compose(
  transformTxInfo,
  reject(isNil)
);
