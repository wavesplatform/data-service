// @deprecated 23.05.2017
// @todo remove if encountered after a month from deplecation

const { identity } = require('ramda');

const Task = require('folktale/concurrency/task');

const createMethod = resolve => method => (...args) =>
  resolve({ [method]: args });

const createSimpleDriver = resolve => {
  const cm = createMethod(resolve);

  return {
    any: cm('any'),
    many: cm('many'),
    oneOrNone: cm('oneOrNone'),
    one: cm('one'),
    none: cm('none'),
  };
};

// mock pgp-like driver
const createDriver = resolve => {
  const taskLike = method => fn =>
    resolve({
      [method]: fn.toString(),
      ...fn({
        ...createSimpleDriver(identity),
        batch: createMethod(identity)('batch'),
      }),
    });

  return {
    ...createSimpleDriver(resolve),
    task: taskLike('task'),
    tx: taskLike('tx'),
  };
};

const driverP = createDriver(x => Promise.resolve(x));
const driverT = createDriver(Task.of);
const driverTBad = createDriver(Task.rejected);

module.exports = {
  driverP,
  driverT,
  driverTBad,
};
