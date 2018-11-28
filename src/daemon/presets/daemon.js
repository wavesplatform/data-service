const { prop, propIs, curryN } = require('ramda');
const Task = require('folktale/concurrency/task');

const loop = (func, cfg, interval) =>
  setTimeout(() => {
    func(cfg);
    loop(func, cfg, interval);
  }, interval);

/** logging :: String -> Object -> Any */
const logging = curryN(3, (level, logger, data) => {
  if (propIs(Function, level, logger)) prop(level, logger)(data);
});

/** main :: Object -> Object -> Number -> TaskExecution */
const main = (funcObject, config, interval, logger = console) =>
  (propIs(Function, 'init', funcObject)
    ? logging('log', logger, '[DAEMON] init ...') ||
      prop('init', funcObject)(config)
    : logging('warn', logger, '[DAEMON] init != Function') || Task.of(config)
  )
    .chain(() =>
      propIs(Function, 'loop', funcObject)
        ? logging('log', logger, '[DAEMON] start loop ...') ||
          Task.task(() => loop(prop('loop', funcObject), config, interval))
        : logging('warn', logger, '[DAEMON] loop != Function') ||
          Task.of(config)
    )
    .run()
    .listen({
      onResolved: data =>
        logging('log', logger, `[DAEMON] stop: ${data ? data : ''}`),
      onRejected: error =>
        logging('error', logger, `[DAEMON] error: ${JSON.stringify(error)}`),
      onCancelled: () => logging('warn', logger, '[DAEMON] task is canceled!'),
    });

module.exports = {
  daemon: main,
  logging
};
