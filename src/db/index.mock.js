const createTaskedDriver = require('./driver');
const { driverConnectMock, createMockAdapter } = require('./__test__/mocks/');

const taskedDbDriverMock = createTaskedDriver({}, driverConnectMock);
const adapter = createMockAdapter(taskedDbDriverMock);

module.exports = adapter;
