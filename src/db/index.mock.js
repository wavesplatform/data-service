const createTaskedDriver = require('./driver');
const { driverP, createMockAdapter } = require('./__test__/mocks/');

const taskedDbDriverMock = createTaskedDriver({}, driverP);
const adapter = createMockAdapter(taskedDbDriverMock);

module.exports = adapter;
