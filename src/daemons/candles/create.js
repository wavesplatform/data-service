const { compose, map, nth } = require('ramda');
const Task = require('folktale/concurrency/task');
const { fromNullable } = require('folktale/maybe');

const getErrorMessage = require('../../errorHandling/getErrorMessage');
const { CandleInterval } = require('../../types');

const logTaskProgress = require('../utils/logTaskProgress');

const {
  withoutStatementTimeout,
  truncateTable,
  insertAllMinuteCandles,
  insertAllCandles,
  selectCandlesAfterTimestamp,
  insertOrUpdateCandles,
  selectLastCandleHeight,
  selectLastExchangeTxHeight,
  insertOrUpdateCandlesFromShortInterval,
  selectMinTimestampFromHeight,
} = require('./sql/query');

/** for combining candles */
const intervalPairs = [
  [CandleInterval.Minute1, CandleInterval.Minute5], // 1m -> 5m
  [CandleInterval.Minute5, CandleInterval.Minute15], // 5m -> 15m
  [CandleInterval.Minute15, CandleInterval.Minute30], // 15m -> 30m
  [CandleInterval.Minute30, CandleInterval.Hour1], // 30m -> 1h
  [CandleInterval.Hour1, CandleInterval.Hour2], // 1h -> 2h
  [CandleInterval.Hour1, CandleInterval.Hour3], // 1h -> 3h
  [CandleInterval.Hour2, CandleInterval.Hour4], // 2h -> 4h
  [CandleInterval.Hour3, CandleInterval.Hour6], // 3h -> 6h
  [CandleInterval.Hour6, CandleInterval.Hour12], // 6h -> 12h
  [CandleInterval.Hour12, CandleInterval.Day1], // 12h -> 24h
  [CandleInterval.Day1, CandleInterval.Week1], // 24h -> 1w
  [CandleInterval.Day1, CandleInterval.Month1], // 24h -> 1M
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
        error: getErrorMessage(e),
      };
    },
    success: (_, timeTaken) => ({
      message: '[CANDLES] update successful',
      time: timeTaken,
    }),
  };

  const pgPromiseUpdateCandles = (t, fromTimetamp) =>
    t
      .any(selectCandlesAfterTimestamp(fromTimetamp))
      .then(candles => t.any(insertOrUpdateCandles(tableName, candles)));

  return logTask(
    logMessages,
    pg.tx(t =>
      t
        .batch([
          t.oneOrNone(selectLastExchangeTxHeight()),
          t.oneOrNone(selectLastCandleHeight(tableName)),
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
        t.none(withoutStatementTimeout()),
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
