const { promiseResolve, promiseReject } = require('../../../utils/test');

const transformFn = xs => xs.map(x => ({ id: x }));

const dbSuccess = {
  many: (_, assetIdArr) => promiseResolve(transformFn(assetIdArr[0]), 100),
};

const dbFail = {
  many: () =>
    promiseReject(new Error('ECONNREFUSED: Unable to connect to db'), 100),
};

module.exports = {
  dbSuccess,
  dbFail,
  transformFn,
};
