const { curryN, compose, chain, map, prop, join } = require('ramda');
const chalk = require('chalk');
const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');

const {
  selectCandlesByMinute,
  insertOrUpdateCandles,
  candleToQuery,
  createCandlesTable,
  createCandlesTableAndFillAll,
} = require('./sql/query');
const { truncSeconds, fillSeconds } = require('../../utils/dateTime');
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
  pgDriver.any(selectEmptyPairsByMinute(startTime, endTime).toString());

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

const updateCandlesLoop = compose(
  task =>
    task.run().listen({
      onResolved: () => {
        printValueWithLabel('Handle time', `${new Date() - startTime} ms`);
        printSuccess('Success update');
      },
      onRejected: printError,
      onCancelled: () => printError('Fail update'),
    }),
  now => updateCandles(truncSeconds(now), fillSeconds(now)),
  tap(now =>
    printValueWithLabel('Candle time range')(
      `${truncSeconds(now).toLocaleTimeString()} - ${fillSeconds(
        now
      ).toLocaleTimeString()}`
    )
  ),
  tap(now => (startTime = now)),
  () => new Date(),
  printDelemiter
);

const updateDBAll = compose(
  () => printDelemiter(),
  () =>
    pgDriver
      .any(createCandlesTableAndFillAll.toString())
      .run()
      .listen({
        onResolved: () => {
          printValueWithLabel('Handle time', `${new Date() - startTime} ms`);
          printSuccess('Success update DB!');
        },
        onRejected: printError,
        onCancelled: () => printError('Fail start is fail'),
      }),
  () => printSuccess('Start updating...'),
  () => printDelemiter(),
  () => (startTime = new Date())
);

const main = compose(
  task =>
    task.run().listen({
      onResolved: () => {
        printSuccess('Daemon is end started!');
      },
      onRejected: printError,
      onCancelled: () => printError('Fail start is fail'),
    }),
  args =>
    ((task, options) =>
      task.chain(() =>
        Task.of(
          options.downloadAllCandles
            ? updateDBAll()
            : setInterval(updateCandlesLoop, options.candlesUpdateInterval)
        )
      ))(...args),
  options => [checkCreateDB(options), options]
);

main(options);
