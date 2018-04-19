const { of, rejected } = require('folktale/concurrency/task');
const createAdapter = require('../../adapter');

const driverConnectMock = () => ({
  many: (sql, args) => Promise.resolve(args),
  none: () => Promise.resolve(),
});

const goodResponseDriver = {
  many: (_, a) => of(a),
};
const badResponseDriver = {
  many: (_, a) => rejected(a),
};

const createMockAdapter = driver =>
  createAdapter({
    taskedDbDriver: driver,
    batchQueryFn: () => x => x,
    errorFactory: () => x => x,
  });

const goodAdapter = createMockAdapter(goodResponseDriver);
const badAdapter = createMockAdapter(badResponseDriver);
module.exports = {
  driverConnectMock,
  goodAdapter,
  badAdapter,
  createMockAdapter,
};
