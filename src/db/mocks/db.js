const { promiseResolve, promiseReject } = require('../../utils/test/');

const dbSuccess = {
  many: (_, assetIdArr) =>
    promiseResolve(assetIdArr[0].map(x => ({ id: x })), 100),
};

const dbFail = {
  many: () => promiseReject('Rand val', 100),
};

module.exports = {
  dbSuccess,
  dbFail,
};
