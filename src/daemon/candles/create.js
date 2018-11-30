const Task = require('folktale/concurrency/task');

const {
  selectCandlesByMinute,
  insertOrUpdateCandles,
  createCandlesTable,
  updateMinutesCandlesAll,
  selectLastCandle,
  selectLastExchange,
  insertAllCandlesBy,
  updateCandlesBy,
} = require('./sql/query');

const logTaskProgress = require('./utils/logTaskProgress');

// @todo dependencies clean up, delete files
const logger = require('../presets/chulkLogger');
const { logging } = require('../presets/daemon');
const { timeStart, timeEnd } = require('../../utils/time');

// @todo sig
const getStartBlock = (exchangeTx, candle) => {
  if (!candle) return 1;

  if (candle.height > exchangeTx.height) {
    return exchangeTx.height - 2000; // handle rollback
  } else {
    return Math.min(candle.height, exchangeTx.height) - 2;
  }
};

const updateCandlesLoop = (logTask, pg) => {
  const logMessages = {
    start: timeStart => ({
      message: '[CANDLES] update started',
      time: timeStart,
    }),
    error: (e, timeTaken) => ({
      message: '[CANDLES] update error',
      time: timeTaken,
      error: e,
    }),
    success: (_, timeTaken) => ({
      message: '[CANDLES] update success',
      time: timeTaken,
    }),
  };

  // Updates minute candles.
  // Uses raw pg-promise.
  const pgPromiseUpdateCandles = (t, startBlockHeight) =>
    t
      .any(selectCandlesByMinute(startBlockHeight))
      .then(candles => t.any(insertOrUpdateCandles(candles)));

  return logTask(
    logMessages,
    pg.tx(t =>
      t
        .batch([t.one(selectLastExchange()), t.any(selectLastCandle())])
        .then(([lastTx, candle]) => {
          const startHeight = getStartBlock(lastTx, candle);
          return pgPromiseUpdateCandles(t, startHeight).then(() => {
            const longerCandlesUpdates = [
              [60, 300],
              [300, 900],
              [900, 1800],
              [1800, 3600],
              [3600, 86400],
            ];
            const toSql = ([shorter, longer]) =>
              t.any(updateCandlesBy(shorter, longer, startHeight));

            return t.batch(longerCandlesUpdates.map(toSql));
          });
        })
    )
  );
};

// @todo refactor
const initAllFoldFrom = (fromFold, fold) =>
  Task.task(
    resolver =>
      logging('log', logger, `[DB] init fold ${fromFold}-${fold}...`) ||
      timeStart(`db-init-fold-${fromFold}-${fold}`) ||
      pgDriver
        .none(insertAllCandlesBy(fromFold, fold).toString())
        .run()
        .listen({
          onResolved: () =>
            logging('log', logger, `[DB] init fold ${fromFold}->${fold}`) ||
            resolver.resolve(),
          onRejected: error =>
            logging(
              'error',
              logger,
              `[DB] init fold ${fromFold}->${fold} error: ${JSON.stringify(
                error
              )}`
            ) || resolver.reject(),
          onCancelled: () =>
            logging(
              'warn',
              logger,
              `[DB] init fold ${fromFold}->${fold} canceled`
            ) || resolver.reject(),
        })
  );

// @todo refactor or remove
const initDBAll = Task.task(
  resolver =>
    timeStart('db-init') ||
    pgDriver
      .none(updateMinutesCandlesAll.toString())
      .run()
      .listen({
        onResolved: () =>
          logging('log', logger, `[DB] init success: ${timeEnd('db-init')}`) ||
          resolver.resolve(),
        onRejected: error =>
          logging(
            'error',
            logger,
            `[DB] init error: ${JSON.stringify(error)}`
          ) || resolver.reject(),
        onCancelled: () =>
          logging('warn', logger, `[DB] init cancel`) || resolver.reject(),
      })
)
  .chain(() => initAllFoldFrom(60, 300))
  .chain(() => initAllFoldFrom(300, 900))
  .chain(() => initAllFoldFrom(900, 1800))
  .chain(() => initAllFoldFrom(1800, 3600))
  .chain(() => initAllFoldFrom(3600, 86400));

// @todo better naming
// @todo do we need it?
const createDB = (logTask, pgDriver) =>
  logTask(
    {
      start: timeStart => ({
        message: '[DB] creating started',
        time: timeStart,
      }),
      error: (e, timeTaken) => ({
        message: '[DB] creating started',
        time: timeTaken,
        error: e,
      }),
      success: (_, timeTaken) => ({
        message: '[DB] creating started',
        time: timeTaken,
      }),
    },
    pgDriver.none(createCandlesTable.toString())
  );

module.exports = ({ logger, pg }, configuration) => {
  const unsafeLogTaskProgress = logTaskProgress(logger);

  return {
    init: () => {
      if (configuration.candlesCreateTable)
        return createDB(unsafeLogTaskProgress, pg);
      else return Task.of();
    },
    loop: () => updateCandlesLoop(unsafeLogTaskProgress, pg),
  };
};
