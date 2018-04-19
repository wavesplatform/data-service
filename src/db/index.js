const createTaskedDriver = require('./driver');
const createAdapter = require('./adapter');

module.exports = options => {
  const taskedDbDriver = createTaskedDriver(options);
  const adapter = createAdapter(taskedDbDriver);
  return adapter;
};
