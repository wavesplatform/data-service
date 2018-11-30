const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');

const tap = require('../../utils/tap');
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
    })
    .catch(e => {
      throw e;
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
              message: '[DAEMON] init not provided',
            }),
          Just: () => {},
        })
      )
    )
    .chain(maybeInit =>
      logTaskProgress(logger)(
        {
          start: timeStart => ({
            message: '[DAEMON] init started',
            time: timeStart,
          }),
          error: (e, timeTaken) => ({
            message: '[DAEMON] init error',
            time: timeTaken,
            error: e,
          }),
          success: (_, timeTaken) => ({
            message: '[DAEMON] init success',
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
              message: '[DAEMON] loop not provided',
            }),
          Just: () => {},
        })
      )
    )
    .chain(maybeLoop =>
      logTaskProgress(logger)(
        {
          start: timeStart => ({
            message: '[DAEMON] start loop',
            time: timeStart,
          }),
          error: (e, timeTaken) => ({
            message: '[DAEMON] loop error',
            time: timeTaken,
            error: e,
          }),
          success: (_, timeTaken) => ({
            message: '[DAEMON] start loop ended',
            time: timeTaken,
          }),
        },
        maybeLoop.matchWith({
          Just: ({ value }) =>
            Task.task(() => loop(value, config, interval, timeout)),
          Nothing: Task.of,
        })
      )
    )
    .run()
    .listen({
      onResolved: () => {
        throw '[DAEMON] stoped but must never';
      },
      onRejected: error => {
        logger.error({
          message: `[DAEMON] error: ${JSON.stringify(error)}`,
          error,
        });
        throw error;
      },
      onCancelled: () =>
        logger.error({
          message: `[DAEMON] start loop canceled`,
        }),
    });

module.exports = {
  daemon: main,
};
