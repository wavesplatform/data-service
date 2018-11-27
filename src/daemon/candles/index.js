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
  updateCandlesAll,
  selectLastCandle,
  selectLastExchange,
} = require('./sql/query');

const {
  printDelemiter,
  printError,
  printSuccess,
  printValueWithLabel,
} = require('./logger');

const { createPgDriver } = require('../../db');
const loadConfig = require('../../loadConfig');
const tap = require('../../utils/tap');

const options = loadConfig();
const pgDriver = createPgDriver(options);

const updateCandles = compose(
  chain(candles =>
    pgDriver.any(insertOrUpdateCandles(candles.map(candleToQuery)))
  ),
  map(
    tap(candles => printValueWithLabel('Handle candles length')(candles.length))
  ),
  startBlock => pgDriver.any(selectCandlesByMinute(startBlock).toString())
);

let startTime;

const checkCreateDB = options =>
  propEq('candlesCreateTable', 'true', options)
    ? pgDriver.none(createCandlesTable.toString())
    : Task.of();

const getStartBlock = (exchange, candle) =>
  compose(
    m => m.getOrElse(1),
    map(([exchangeHeight, candleHeight]) =>
      gt(candleHeight, exchangeHeight)
        ? exchangeHeight - 2000
        : lt(candleHeight, exchangeHeight)
        ? candleHeight - 2
        : exchangeHeight - 2
    ),
    () =>
      and(has('height', exchange), has('max_height', candle))
        ? Maybe.of([prop('height', exchange), prop('max_height', candle)])
        : Maybe.Nothing()
  )();

const updateCandlesLoop = compose(
  task =>
    task.run().listen({
      onResolved: () => {
        printValueWithLabel('Handle time', `${new Date() - startTime} ms`);
        printSuccess('Success update');
        printDelemiter();
        setTimeout(updateCandlesLoop, options.candlesUpdateInterval);
      },
      onRejected: printError,
      onCancelled: () => printError('Fail update'),
    }),
  chain(candle =>
    pgDriver
      .one(selectLastExchange().toString())
      .chain(exchange => updateCandles(getStartBlock(exchange, candle)))
  ),
  () => pgDriver.one(selectLastCandle().toString()),
  () => (startTime = new Date())
);

const updateDBAll = compose(
  task =>
    task.run().listen({
      onResolved: () => {
        printValueWithLabel('Handle time', `${new Date() - startTime} ms`);
        printSuccess('Success update DB!');
        printDelemiter();
        setTimeout(updateCandlesLoop, options.candlesUpdateInterval);
      },
      onRejected: printError,
      onCancelled: () => printError('Fail start is fail'),
    }),
  chain(() => Task.of(updateCandlesLoop)),
  chain(() => pgDriver.none(console.log(updateCandlesAll.toString()) || updateCandlesAll.toString())),
  () => pgDriver.none(createCandlesTable.toString()),
  () => printSuccess('Start updating all candles ...'),
  () => (startTime = new Date())
);

const main = compose(
  task =>
    task.run().listen({
      onResolved: () => {},
      onRejected: printError,
      onCancelled: () => printError('Daemon start is fail'),
    }),
  chain(() =>
    Task.of(options.downloadAllCandles ? updateDBAll() : updateCandlesLoop())
  ),
  tap(() => printDelemiter()),
  checkCreateDB
);

main(options);
