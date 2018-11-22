const Maybe = require('folktale/maybe');
const { compose, curryN, find, forEach, map, splitEvery } = require('ramda');
const { BigNumber } = require('@waves/data-entities');

const { List } = require('../../types');
const { intervalSize } = require('../../utils/interval');

// calculateIntervaledCandles :: [[Candle]] -> [Candle]
const calculateIntervaledCandles = сandlesInInterval => {
  const resultCandle = {
    time_start: сandlesInInterval[0].time_start,
    open: сandlesInInterval[0].open,
    close: сandlesInInterval[сandlesInInterval.length - 1].close,
    low: null,
    high: 0,
    volume: BigNumber(0),
    price_volume: BigNumber(0),
    max_height: 0,
    weighted_average_price: 0,
    txs_count: 0,
  };

  forEach(candle => {
    if (candle.low < resultCandle.low || resultCandle.low === null) {
      resultCandle.low = candle.low;
    }
    if (candle.high > resultCandle.high) {
      resultCandle.high = candle.high;
    }
    resultCandle.volume = resultCandle.volume.plus(candle.volume);
    resultCandle.price_volume = resultCandle.price_volume.plus(
      candle.price_volume
    );
    if (candle.max_height > resultCandle.max_height) {
      resultCandle.max_height = candle.max_height;
    }
    resultCandle.txs_count += candle.txs_count;
  }, сandlesInInterval);

  resultCandle.weighted_average_price = resultCandle.price_volume.dividedBy(
    resultCandle.volume
  );

  return resultCandle;
};

// addMisingCandles :: String -> String -> Number ->
const addMissingCandles = curryN(
  4,
  (timeStart, timeEnd, intervalSizeInMin, candles) => {
    const start =
        Math.floor(new Date(timeStart).valueOf() / (1000 * 60)) * 1000 * 60,
      end = Math.ceil(new Date(timeEnd).valueOf() / (1000 * 60)) * 1000 * 60,
      intervalSizeInMs = intervalSizeInMin * 1000 * 60;

    const emptyCandle = {
      time_start: null,
      open: BigNumber(0),
      close: BigNumber(0),
      low: BigNumber(0),
      high: BigNumber(0),
      volume: BigNumber(0),
      price_volume: BigNumber(0),
      max_height: BigNumber(0),
      weighted_average_price: BigNumber(0),
      txs_count: 0,
    };

    const fullFilled = [];

    for (let it = start; it < end; it += intervalSizeInMs) {
      const candleInInterval = find(candle => {
        const time = new Date(candle.time_start).valueOf();
        return it <= time && time <= it + intervalSizeInMs;
      }, candles);

      if (candleInInterval) {
        fullFilled.push(candleInInterval);
      } else {
        const newCandle = Object.assign({}, emptyCandle, { time_start: it });
        fullFilled.push(newCandle);
      }
    }

    return fullFilled;
  }
);

/** transformResults :: (DbResponse[], request) -> List Maybe t */
const transformResults = (result, request) =>
  compose(
    map(List),
    addMissingCandles(
      request.params.timeStart,
      request.params.timeEnd,
      intervalSize(request.params.interval)
    ),
    map(calculateIntervaledCandles),
    splitEvery(intervalSize(request.params.interval)),
    map(m => m.getOrElse(null)),
    map(Maybe.fromNullable)
  )(result);

module.exports = transformResults;
