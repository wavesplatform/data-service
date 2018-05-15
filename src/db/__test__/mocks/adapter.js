const createAdapter = require('../../adapter');

const { driverT, driverTBad } = require('./driver');

const createMockAdapter = driver =>
  createAdapter({
    taskedDbDriver: driver,
    batchQueryFn: () => x => x,
    errorFactory: () => x => x,
  });

const goodAdapter = createMockAdapter(driverT);
const badAdapter = createMockAdapter(driverTBad);

module.exports = {
  createMockAdapter,
  goodAdapter,
  badAdapter,
};
