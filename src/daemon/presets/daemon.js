const { compose, chain, prop, propIs } = require('ramda');
const Task = require('folktale/concurrency/task');

const {
  printWarning,
  printSuccess,
  printErrorValueWithLabel,
} = require('../presets/logger');

const loop = (func, configuration, interval) =>
  setTimeout(
    compose(
      () => loop(func, configuration, interval),
      () => func(configuration)
    ),
    interval
  );

const main = (functions, configuration, loopInterval) =>
  compose(
    task =>
      task.run().listen({
        onResolved: () => printSuccess('[DAEMON] success start end'),
        onRejected: error =>
          printErrorValueWithLabel('[DAEMON] error', JSON.stringify(error)),
        onCancelled: () => printWarning('[DAEMON] task is canceled!'),
      }),
    chain(
      () => {
        if (propIs(Function, 'loop', functions)) {
          return Task.task(() =>
            loop(prop('loop', functions), configuration, loopInterval)
          );
        } else {
          printWarning(`[DAEMON] loop !== Function`);
          return Task.of(configuration);
        }
      }
    ),
    configuration =>
      propIs(Function, 'init', functions)
        ? printSuccess(`[DAEMON] init()`) ||
          prop('init', functions)(configuration)
        : printWarning(`[DAEMON] init !== Function => loop()`) ||
          Task.of(configuration)
  )(configuration);

module.exports = {
  daemon: main,
};
