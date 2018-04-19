const createTaskedDriver = require('./driver');
const { driverConnectMock, createMockAdapter } = require('./__test__/mocks/');

module.exports = () => {
  const taskedDbDriverMock = createTaskedDriver({}, driverConnectMock);
  const adapter = createMockAdapter(taskedDbDriverMock);
  return adapter;
};
