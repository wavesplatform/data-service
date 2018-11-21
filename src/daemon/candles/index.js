const tap = require('../../utils/tap');

const { curryN, compose, chain, map } = require('ramda');
const Maybe = require('folktale/maybe');
const Result = require('folktale/result');
const Task = require('folktale/concurrency/task');

const { selectEmptyPairsByMinute } = require('./sql/query');
const { truncSeconds, fillSeconds } = require('../../utils/dateTime');
const { createPgDriver } = require('../../db');
const loadConfig = require('../../loadConfig');

const options = loadConfig();
const pgDriver = createPgDriver(options);

const getCandles = (startTime, endTime) =>
  pgDriver.any(selectEmptyPairsByMinute(startTime, endTime).toString());

const DELEMITER = '----------------------------------------';

const updateCandles = 
  composeK(
    // map(tap(console.log)),
    candles => {
        const t1 = pgDriver.any(getUsers(candles))
        const t2 = pgDriver.any(getAuthStatus(candles))

        return Task.waitAll([t1, t2]).map(([t1Res, t2Res]) => [t1Res, t2Res, candles])
    },
    // task => task.orElse(() => Task.of('Second task')),
    getCandles
  );

function main(options) {
  setInterval(
    compose(
      task => task.run().listen({ onResolved: console.log, onRejected: console.error }),
    //   tap(v => console.log(v)),
      now => updateCandles(truncSeconds(now), fillSeconds(now)),
      tap(now => console.log(`endTime: ${fillSeconds(now)}`)),
      tap(now => console.log(`startTime: ${truncSeconds(now)}`)),
      () => new Date(),
      () => console.log(DELEMITER)
    ),
    options.candlesUpdateInterval
  );
}

main(options);
