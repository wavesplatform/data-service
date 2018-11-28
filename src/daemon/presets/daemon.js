const { prop, propIs } = require('ramda');
const Task = require('folktale/concurrency/task');

const {
  printWarning,
  printSuccess,
  printErrorValueWithLabel,
} = require('../../utils/logger');

const loop = (func, cfg, interval) =>
  setTimeout(() => {
    func(cfg);
    loop(func, cfg, interval);
  }, interval);

const main = (functions, cfg, interval) =>
  (propIs(Function, 'init', functions)
    ? printSuccess(`[DAEMON] init()`) || prop('init', functions)(cfg)
    : printWarning(`[DAEMON] init !== Function => loop()`) || Task.of(cfg)
  )
    .chain(() =>
      propIs(Function, 'loop', functions)
        ? Task.task(() => loop(prop('loop', functions), cfg, interval))
        : printWarning(`[DAEMON] loop !== Function`) || Task.of(cfg)
    )
    .run()
    .listen({
      onResolved: () => printSuccess('[DAEMON] success start end'),
      onRejected: error =>
        printErrorValueWithLabel('[DAEMON] error', JSON.stringify(error)),
      onCancelled: () => printWarning('[DAEMON] task is canceled!'),
    });

module.exports = {
  daemon: main,
};
