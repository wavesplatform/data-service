const { promiseResolve, promiseReject } = require('../../utils/test/');

const transformFn = x => ({ id: x });

const dbSuccess = {
  many: (_, assetIdArr) => promiseResolve(assetIdArr[0].map(transformFn), 100),
};

const dbFail = {
  many: () => promiseReject('Rand val', 100),
};

module.exports = {
  dbSuccess,
  dbFail,
  transformFn,
};
