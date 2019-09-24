const { compose, head, map, nth } = require('ramda');
const Task = require('folktale/concurrency/task');
const { fromNullable } = require('folktale/maybe');

const logTaskProgress = require('../utils/logTaskProgress');

const {
  truncateTable,
  insertAllMinuteCandles,
  insertAllCandles,
  selectCandlesByMinute,
  insertOrUpdateCandles,
  selectLastCandle,
  selectLastExchangeTx,
  insertOrUpdateCandlesFromShortInterval,
  selectMinTimestampFromHeight,
} = require('./sql/query');

/** for combining candles */
const intervalPairs = [
  [60, 300], // 1m -> 5m
  [300, 900], // 5m -> 15m
  [900, 1800], // 15m -> 30m
  [1800, 3600], // 30m -> 1h
  [3600, 10800], // 1h -> 3h
  [10800, 21600], // 3h -> 6h
  [21600, 43200], // 6h -> 12h
  [43200, 86400], // 12h -> 24h
];

/** getStartBlock :: (Object, Object) -> Number */
const getStartBlock = (exchangeTx, candle) => {
  if (candle && exchangeTx) {
    if (candle.max_height > exchangeTx.height) {
      return exchangeTx.height - 2000; // handle rollback
    } else {
      return candle.max_height - 1;
    }
  }

  return 1;
};

/** updateCandlesLoop :: (LogTask, Pg, String) -> Task */
const updateCandlesLoop = (logTask, pg, tableName) => {
  const logMessages = {
    start: timeStart => ({
      message: '[CANDLES] start updating candles',
      time: timeStart,
    }),
    error: (e, timeTaken) => {
      return {
        message: '[CANDLES] update error',
        time: timeTaken,
        error: e,
      };
    },
    success: (_, timeTaken) => ({
      message: '[CANDLES] update successful',
      time: timeTaken,
    }),
  };

  const pgPromiseUpdateCandles = (t, fromTimetamp) =>
    t
      .any(selectCandlesByMinute(fromTimetamp))
      .then(candles => t.any(insertOrUpdateCandles(tableName, candles)));

  return logTask(
    logMessages,
    pg.tx(t =>
      t
        .batch([
          t.oneOrNone(selectLastExchangeTx()),
          t.oneOrNone(selectLastCandle(tableName)),
        ])
        .then(([lastTx, candle]) => {
          if (!lastTx) {
            return new Date();
          }
          const startHeight = getStartBlock(lastTx, candle);
          return t
            .one(selectMinTimestampFromHeight(startHeight))
            .then(row => row.time_stamp);
        })
        .then(timestamp => {
          const nextInterval = compose(
            m => m.getOrElse(undefined),
            map(interval =>
              t.any(
                insertOrUpdateCandlesFromShortInterval(
                  tableName,
                  timestamp,
                  interval[0],
                  interval[1]
                )
              )
            ),
            fromNullable,
            index => nth(index, intervalPairs)
          );

          return pgPromiseUpdateCandles(t, timestamp).then(() =>
            t.sequence(nextInterval)
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
        message: '[DB] start filling',
        time: timeStart,
      }),
      error: (e, timeTaken) => ({
        message: '[DB] fill error',
        time: timeTaken,
        error: e,
      }),
      success: (_, timeTaken) => ({
        message: '[DB] fill successful',
        time: timeTaken,
      }),
    },
    pg.tx(t =>
      t.batch([
        t.any(truncateTable(tableName)),
        t.any(insertAllMinuteCandles(tableName)),
        ...intervalPairs.map(([shorter, longer]) =>
          t.any(insertAllCandles(tableName, shorter, longer))
        ),
      ])
    )
  );

module.exports = ({ logger, pg }, configuration) => {
  const unsafeLogTaskProgress = logTaskProgress(logger);

  return {
    init: () => {
      if (configuration.candlesTruncateTable)
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
