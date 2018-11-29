const { prop, curryN } = require('ramda');
const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');

/** getSleepTime :: Date -> Number ms -> Number ms */
const getSleepTime = (start, interval) => {
  let diff = interval - (new Date() - start);
  return diff < 0 ? 0 : diff;
};

/** loop :: (Object -> Task) -> Object -> Number -> Number -> Promise */
const loop = (func, cfg, interval, timeout) => {
  let startLoop = new Date();

  return Task.waitAny([
    func(cfg),
    Task.task(resolver => {
      const timerId = setTimeout(resolver.reject, timeout);
      resolver.cleanup(() => clearTimeout(timerId));
    }),
  ])
    .run()
    .promise()
    .then(() => {
      setTimeout(
        () => loop(func, cfg, interval, timeout),
        getSleepTime(startLoop, interval)
      );
    })
    .catch(() => loop(func, cfg, interval, timeout));
};

/** logging :: String -> Object -> Any -> undefined */
const logging = curryN(3, (level, logger, data) => {
  if (typeof prop(level, logger) === 'function') prop(level, logger)(data);
  return undefined;
});

/** main :: Object -> Object -> Number -> TaskExecution */
const main = (funcObject, config, interval, timeout, logger = console) =>
  Task.of(Maybe.fromNullable(funcObject.init))
    // init
    .chain(maybeInit =>
      maybeInit.matchWith({
        Just: ({ value }) => {
          logging('log', logger, '[DAEMON] init ...');
          return value(config);
        },
        Nothing: () => {
          logging('warn', logger, '[DAEMON] init not provided');
          return Task.of();
        },
      })
    )
    // loop
    .chain(() => {
      return funcObject.loop
        ? logging('log', logger, '[DAEMON] start loop ...') ||
            Task.task(() => loop(funcObject.loop, config, interval, timeout))
        : logging('warn', logger, '[DAEMON] loop not provided') || Task.of();
    })
    .run()
    .listen({
      onResolved: () => {
        throw '[DAEMON] stoped but must never';
      },
      onRejected: error => {
        logging('error', logger, `[DAEMON] error: ${JSON.stringify(error)}`);
        throw error;
      },
      onCancelled: () =>
        logging('error', logger, `[DAEMON] start loop canceled`),
    });

module.exports = {
  daemon: main,
  logging,
};
