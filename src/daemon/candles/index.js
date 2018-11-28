const { compose, map, prop, has, and, gt, lt, propEq } = require('ramda');
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

const logger = require('../presets/chulkLogger');
const { daemon, logging } = require('../presets/daemon');
const { timeStart, timeEnd } = require('../../utils/time');

const { createPgDriver } = require('../../db');
const loadConfig = require('../../loadConfig');

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

const updateCandles = startBlock =>
  pgDriver
    .any(selectCandlesByMinute(startBlock).toString())
    .chain(
      candles =>
        logging('log', logger, `[CANDLES] length: ${candles.length}`) ||
        pgDriver.any(insertOrUpdateCandles(candles.map(candleToQuery)))
    );

const updateCandlesLoop = () => {
  printSuccessValueWithLabel('[CANDLES] date', new Date().toLocaleTimeString());
  timeStart('candle-update');
  pgDriver
    .one(selectLastCandle().toString())
    .chain(candle =>
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
    )
    .run()
    .listen({
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
    });
};

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
        onResolved: data =>
          logging(
            'log',
            logger,
            `[DB] creating success: ${data ? data : ''}`
          ) || resolver.resolve(),
        onRejected: error =>
          logging(
            'error',
            logger,
            `[DB] creating error: ${JSON.stringify(error)}`
          ) || resolver.reject(),
        onCancelled: () =>
          logging('warn', logger, '[DB] creating cancel') || resolver.reject(),
      })
).chain(() => logging('log', logger, '[DB] init ...') || initDBAll);

daemon(
  {
    init: configuration =>
      propEq('candlesCreateTable', 'true', configuration)
        ? logging('log', logger, '[DB] creating ...') || createDB
        : Task.of(),
    loop: updateCandlesLoop,
  },
  options,
  options.candlesUpdateInterval,
  logger
);
