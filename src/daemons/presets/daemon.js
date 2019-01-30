const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');

const { tap } = require('../../utils/tap');
const logTaskProgress = require('../utils/logTaskProgress');

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
      const timerId = setTimeout(
        () => resolver.reject(new Error('[DAEMON] timeout expired')),
        timeout
      );
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
    });
};

/** main :: Object { init, loop } -> Object -> Number ms -> Number ms -> Object { info, warn, error } -> TaskExecution */
const main = (daemon, config, interval, timeout, logger) =>
  Task.of(Maybe.fromNullable(daemon.init))
    .map(
      tap(maybeInit =>
        maybeInit.matchWith({
          Nothing: () =>
            logger.warn({
              message: '[DAEMON] init function not found',
            }),
          Just: () => {},
        })
      )
    )
    .chain(maybeInit =>
      logTaskProgress(logger)(
        {
          start: timeStart => ({
            message: '[DAEMON] initialization started',
            time: timeStart,
          }),
          error: (e, timeTaken) => ({
            message: '[DAEMON] initialization error',
            time: timeTaken,
            error: e,
          }),
          success: (_, timeTaken) => ({
            message: '[DAEMON] initialization successful',
            time: timeTaken,
          }),
        },
        maybeInit.getOrElse(Task.of)(config)
      )
    )
    .map(() => Maybe.fromNullable(daemon.loop))
    .map(
      tap(maybeLoop =>
        maybeLoop.matchWith({
          Nothing: () =>
            logger.warn({
              message: '[DAEMON] loop function not found',
            }),
          Just: () => {},
        })
      )
    )
    .chain(maybeLoop =>
      logTaskProgress(logger)(
        {
          start: timeStart => ({
            message: '[DAEMON] loop started',
            time: timeStart,
          }),
          error: (e, timeTaken) => ({
            message: '[DAEMON] loop error',
            time: timeTaken,
            error: e,
          }),
          success: (_, timeTaken) => ({
            message: '[DAEMON] loop successfully stopped',
            time: timeTaken,
          }),
        },
        maybeLoop.matchWith({
          Just: ({ value }) =>
            Task.task(resolver =>
              loop(value, config, interval, timeout).catch(e =>
                resolver.reject(e)
              )
            ),
          Nothing: () => Task.rejected('[DAEMON] loop function not found'),
        })
      )
    )
    .run()
    .listen({
      onResolved: () => {
        throw '[DAEMON] loop is stopped but never should';
      },
      onRejected: error =>
        logger.error({
          message: `[DAEMON] error: ${error}`,
          error,
        }),
      onCancelled: () =>
        logger.error({
          message: `[DAEMON] loop canceled`,
        }),
    });

module.exports = {
  daemon: main,
};
