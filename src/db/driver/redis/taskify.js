// Module transforms node-redis client instance
// into a subset of methods returning Task
const { promisify } = require('util');
const { fromPromised } = require('folktale/concurrency/task');

const { map, pick, compose, assoc } = require('ramda');

const taskifyDriver = driver => {
  const taskify = compose(
    fromPromised,
    promisify
  );
  const taskifyMethod = obj =>
    compose(
      taskify,
      fn => fn.bind(obj)
    );

  const taskifySimpleMethods = compose(
    map(taskifyMethod(driver)),
    pick(['get', 'set', 'mget', 'mset'])
  );

  const multi = compose(
    // @impure
    // mutates original `Multi` object but that's OK
    // since a new instance gets created each time
    multiObj => {
      multiObj.exec = taskifyMethod(multiObj)(multiObj.exec);
      return multiObj;
    },
    driver.multi.bind(driver)
  );

  return compose(
    assoc('multi', multi),
    taskifySimpleMethods
  )(driver);
};

module.exports = taskifyDriver;
