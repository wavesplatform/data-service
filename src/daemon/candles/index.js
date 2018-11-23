const {
  curryN,
  compose,
  chain,
  map,
  prop,
  join,
  propOr,
  eqProps,
  equals,
  ifElse,
  cond,
  always,
  allPass,
  has,
  and,
  or,
  gt
} = require('ramda');
const chalk = require('chalk');
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

const { createPgDriver } = require('../../db');
const loadConfig = require('../../loadConfig');
const tap = require('../../utils/tap');

const options = loadConfig();
const pgDriver = createPgDriver(options);

const DELEMITER = '----------------------------------------';
const printDelemiter = () => console.log(DELEMITER);
const printValueWithLabel = curryN(2, (label, value) =>
  console.log(`${chalk.green(label)}: ${value}`)
);
const printError = value => console.log(chalk.red(value));
const printSuccess = value => console.log(chalk.green(value));

const getCandles = (startTime, endTime) =>
  pgDriver.any(selectCandlesByMinute(startTime, endTime).toString());

const updateCandles = compose(
  chain(candles =>
    pgDriver.any(insertOrUpdateCandles(candles.map(candleToQuery)))
  ),
  map(
    tap(candles => printValueWithLabel('Handle candles length')(candles.length))
  ),
  getCandles
);

let startTime;

const checkCreateDB = compose(
  isCreate =>
    isCreate.matchWith({
      Just: () => pgDriver.none(createCandlesTable.toString()),
      Nothing: Task.of,
    }),
  Maybe.of,
  prop('candlesCreateTable')
);

const getUpdateTime = (exchange, candle) => [
  console.log(
    or(has('height', exchange), has('max_height', candle))
      ? and(has('height', exchange), has('max_height', candle))
        ? gt(prop('max_height', candle), prop('height', exchange)) ? prop('time_stamp', exchange) : prop('time_start', candle)
        : propOr(prop('time_start', candle), 'time_stamp', exchange)
      : new Date(0)
  ) || new Date(),
  new Date(),
];

const updateCandlesLoop = compose(
  task =>
    task.run().listen({
      onResolved: () => {
        printValueWithLabel('Handle time', `${new Date() - startTime} ms`);
        printSuccess('Success update');
        setTimeout(updateCandlesLoop, options.candlesUpdateInterval);
      },
      onRejected: printError,
      onCancelled: () => printError('Fail update'),
    }),
  chain(candle =>
    pgDriver
      .one(selectLastExchange().toString())
      .chain(exchange => updateCandles(...getUpdateTime(exchange, candle)))
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
  chain(() => pgDriver.none(updateCandlesAll.toString())),
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
  tap(() => printDelemiter()),
  ([task, options]) =>
    task.chain(() =>
      Task.of(options.downloadAllCandles ? updateDBAll() : updateCandlesLoop())
    ),
  options => [checkCreateDB(options), options]
);

main(options);
