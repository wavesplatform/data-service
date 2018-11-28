const {
  compose,
  chain,
  map,
  prop,
  has,
  and,
  gt,
  lt,
  propEq,
} = require('ramda');
const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');

const {
  selectCandlesByMinute,
  insertOrUpdateCandles,
  candleToQuery,
  createCandlesTable,
  updateMinutesCandlesAll,
  selectLastCandle,
  selectLastExchange,
  insertAllCandlesBy,
  updateCandlesBy,
} = require('./sql/query');

const {
  printDelemiter,
  printError,
  printSuccess,
  printSuccessValueWithLabel,
  printErrorValueWithLabel,
} = require('../presets/logger');
const { daemon } = require('../presets/daemon');
const { timeStart, timeEnd } = require('../presets/time');

const { createPgDriver } = require('../../db');
const loadConfig = require('../../loadConfig');
const tap = require('../../utils/tap');

const options = loadConfig();
const pgDriver = createPgDriver(options);

const getStartBlock = (exchange, candle) =>
  compose(
    m => m.getOrElse(1),
    map(([exchangeHeight, candleHeight]) => {
      if (gt(candleHeight, exchangeHeight)) {
        return exchangeHeight - 2000; // Rollback
      } else {
        return lt(candleHeight, exchangeHeight)
          ? candleHeight - 2
          : exchangeHeight - 2;
      }
    }),
    () =>
      and(has('height', exchange), has('max_height', candle))
        ? Maybe.of([prop('height', exchange), prop('max_height', candle)])
        : Maybe.Nothing()
  )();

const updateCandles = compose(
  chain(candles =>
    pgDriver.any(insertOrUpdateCandles(candles.map(candleToQuery)))
  ),
  map(
    tap(candles =>
      printSuccessValueWithLabel('[CANDLES] length')(candles.length)
    )
  ),
  startBlock => pgDriver.any(selectCandlesByMinute(startBlock).toString())
);

const updateCandlesLoop = compose(
  task =>
    task.run().listen({
      onResolved: () => {
        printSuccessValueWithLabel(
          `[CANDLES] handle time`,
          timeEnd(`candle-update`)
        ) || printDelemiter();
      },
      onRejected: error =>
        printErrorValueWithLabel(
          `[CANDLES] update fail`,
          JSON.stringify(error)
        ),
      onCancelled: () => printError(`[CANDLES] update canceled`),
    }),
  chain(candle =>
    pgDriver.one(selectLastExchange().toString()).chain(exchange =>
      Task.of(getStartBlock(exchange, candle)).chain(height =>
        updateCandles(height)
          .chain(() => pgDriver.any(updateCandlesBy(1, 300, height)))
          .chain(() => pgDriver.any(updateCandlesBy(300, 900, height)))
          .chain(() => pgDriver.any(updateCandlesBy(900, 1800, height)))
          .chain(() => pgDriver.any(updateCandlesBy(1800, 3600, height)))
          .chain(() => pgDriver.any(updateCandlesBy(3600, 86400, height)))
      )
    )
  ),
  () => pgDriver.one(selectLastCandle().toString()),
  () =>
    printSuccessValueWithLabel(
      '[CANDLES] date',
      new Date().toLocaleTimeString()
    ) || timeStart('candle-update')
);

const initAllFoldFrom = (fromFold, fold) =>
  Task.task(
    resolver =>
      printSuccess(`[DB] init fold ${fromFold}-${fold}...`) ||
      timeStart(`db-init-fold-${fromFold}-${fold}`) ||
      pgDriver
        .none(insertAllCandlesBy(fromFold, fold).toString())
        .run()
        .listen({
          onResolved: () =>
            printSuccessValueWithLabel(
              `[DB] init fold ${fromFold}->${fold}`,
              timeEnd(`db-init-fold-${fromFold}-${fold}`)
            ) || resolver.resolve(),
          onRejected: error =>
            printErrorValueWithLabel(
              `[DB] init fold ${fromFold}->${fold}`,
              JSON.stringify(error)
            ) || resolver.reject(),
          onCancelled: () =>
            printError(`[DB] init fold ${fromFold}->${fold}`) ||
            resolver.reject(),
        })
  );

const initDBAll = Task.task(
  resolver =>
    timeStart('db-init') ||
    pgDriver
      .none(updateMinutesCandlesAll.toString())
      .run()
      .listen({
        onResolved: () =>
          printSuccessValueWithLabel('[DB] init success', timeEnd('db-init')) ||
          resolver.resolve(),
        onRejected: error =>
          printErrorValueWithLabel('[DB] init error', JSON.stringify(error)) ||
          resolver.reject(),
        onCancelled: () => printError('[DB] init cancel') || resolver.reject(),
      })
)
  .chain(() => initAllFoldFrom(60, 300))
  .chain(() => initAllFoldFrom(300, 900))
  .chain(() => initAllFoldFrom(900, 1800))
  .chain(() => initAllFoldFrom(1800, 3600))
  .chain(() => initAllFoldFrom(3600, 86400));

const createDB = Task.task(
  resolver =>
    timeStart('db-create') ||
    pgDriver
      .none(createCandlesTable.toString())
      .run()
      .listen({
        onResolved: () =>
          printSuccessValueWithLabel(
            '[DB] creating success',
            timeEnd('db-create')
          ) || resolver.resolve(),
        onRejected: error =>
          printErrorValueWithLabel(
            '[DB] creating error',
            JSON.stringify(error)
          ) || resolver.reject(),
        onCancelled: () =>
          printError('[DB] creating cancel') || resolver.reject(),
      })
).chain(() => printSuccess('[DB] init ...') || initDBAll);

daemon(
  {
    init: configuration =>
      propEq('candlesCreateTable', 'true', configuration)
        ? printSuccess('[DB] creating ...') || createDB
        : Task.of(),
    loop: updateCandlesLoop,
  },
  options,
  options.candlesUpdateInterval
);
