const { identity } = require('ramda');

const Task = require('folktale/concurrency/task');

const createSimpleDriver = resolve => {
  const anyLike = (sql, x) => resolve(x);

  return {
    any: anyLike,
    many: anyLike,
    oneOrNone: anyLike,
    one: anyLike,
    none: () => resolve(),
  };
};

// mock pgp-like driver
const createDriver = resolve => {
  const taskLike = fn =>
    resolve(fn({ ...createSimpleDriver(identity), batch: identity }));

  return {
    ...createSimpleDriver(resolve),
    task: taskLike,
    tx: taskLike,
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
