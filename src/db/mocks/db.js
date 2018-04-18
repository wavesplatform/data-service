const { promiseResolve, promiseReject } = require('../../utils/test/');

const transformFn = xs => xs.map(x => ({ id: x }));

const dbSuccess = {
  many: (_, assetIdArr) => promiseResolve(transformFn(assetIdArr[0]), 100),
};

const dbFail = {
  many: () => promiseReject('Rand val', 100),
};

module.exports = {
  dbSuccess,
  dbFail,
  transformFn,
};
