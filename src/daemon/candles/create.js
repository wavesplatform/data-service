const Task = require('folktale/concurrency/task');

const {
  dropTable,
  insertAllMinuteCandles,
  calculateAllCandles,
  selectCandlesByMinute,
  insertOrUpdateCandles,

  selectLastCandle,
  selectLastExchange,
  calculateCandles,
} = require('./sql/query');

const logTaskProgress = require('../utils/logTaskProgress');

const intervalPairs = [
  [60, 300],
  [300, 900],
  [900, 1800],
  [1800, 3600],
  [3600, 86400],
];

/** getStartBlock :: (Object, Object) -> Number */
const getStartBlock = (exchangeTx, candle) => {
  if (candle && exchangeTx) {
    if (candle.max_height > exchangeTx.height) {
      return exchangeTx.height - 2000; // handle rollback
    } else {
      return Math.min(candle.max_height, exchangeTx.height) - 2;
    }
  }

  return 1;
};

/** updateCandlesLoop :: (LogTask, Pg, String) -> Task */
const updateCandlesLoop = (logTask, pg, tableName) => {
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

  const pgPromiseUpdateCandles = (t, startBlockHeight) =>
    t
      .any(selectCandlesByMinute(startBlockHeight))
      .then(candles => t.any(insertOrUpdateCandles(tableName, candles)));

  return logTask(
    logMessages,
    pg.tx(t =>
      t
        .batch([t.any(selectLastExchange()), t.any(selectLastCandle(tableName))])
        .then(([lastTx, candle]) => {
          const startHeight = getStartBlock(
            head(lastTx),
            head(candle)
          );
          return pgPromiseUpdateCandles(t, startHeight).then(() =>
            t.batch(
              intervalMap.map(([shorter, longer]) =>
                t.any(calculateCandles(tableName, shorter, longer, startHeight))
              )
            )
          );
        })
    )
  );
};

/** fillCandlesDBAll :: (LogTask, Pg, String) -> Task */
const fillCandlesDBAll = (logTask, pg, tableName) =>
  logTask(
    {
      start: timeStart => ({
        message: '[DB] start fill',
        time: timeStart,
      }),
      error: (e, timeTaken) => ({
        message: '[DB] fill error',
        time: timeTaken,
        error: e,
      }),
      success: (_, timeTaken) => ({
        message: '[DB] fill success',
        time: timeTaken,
      }),
    },
    pg.tx(t =>
      t.batch([
        t.any(dropTable(tableName)), // @todo truncate
        t.any(insertAllMinuteCandles(tableName)),
        ...intervalMap.map(([shorter, longer]) =>
          t.any(calculateAllCandles(tableName, shorter, longer))
        ),
      ])
    )
  );

module.exports = ({ logger, pg }, configuration) => {
  const unsafeLogTaskProgress = logTaskProgress(logger);

  return {
    init: () => {
      if (configuration.candlesCreateTable)
        return fillCandlesDBAll(
          unsafeLogTaskProgress,
          pg,
          configuration.candlesTableName
        );
      else return Task.of();
    },
    loop: () =>
      updateCandlesLoop(
        unsafeLogTaskProgress,
        pg,
        configuration.candlesTableName
      ),
  };
};
