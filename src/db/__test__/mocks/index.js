const createDriver = require('./driver');

const Task = require('folktale/concurrency/task');

module.exports = {
  driver: {
    create: createDriver,
    createT: createDriver(Task.of),
  },
};
