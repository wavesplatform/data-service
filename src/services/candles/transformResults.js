const { compose, curryN, groupBy, map, sort, toPairs } = require('ramda');
const { renameKeys } = require('ramda-adjunct');
const { Interval, List } = require('../../types');
const concatAll = require('../../utils/fp/concatAll');
const { floor, ceil, add } = require('../../utils/date');
const { candleMonoid } = require('./candleMonoid');

const transformCandle = ([time, candle]) => {
  return {
    ...renameKeys(
      {
        price_volume: 'priceVolume',
        weighted_average_price: 'weightedAveragePrice',
        max_height: 'maxHeight',
        txs_count: 'txsCount',
        time_start: 'time',
      },
      {
        ...candle,
        high: candle.high == -Infinity ? null : candle.high,
        low: candle.low == +Infinity ? null : candle.low,
        volume: candle.volume.comparedTo(0) === 0 ? null : candle.volume,
        price_volume: candle.price_volume.comparedTo(0) === 0 ? null : candle.price_volume,
        weighted_average_price: candle.weighted_average_price.comparedTo(0) === 0 ? null : candle.weighted_average_price,
        txs_count: candle.txs_count || null,
        max_height: candle.max_height || null
      }
    ),
    time: new Date(candle.time_start || time),
  };
};

// addMissingCandles :: Interval -> Date -> Date -> {String: [Candle]} -> {String: [Candle]}
const addMissingCandles = curryN(
  4,
  (interval, timeStart, timeEnd, candlesGroupedByTime) => {
    const end = timeEnd;

    for (
      let it = ceil(interval, timeStart);
      it <= end;
      it = add(interval, it)
    ) {
      const cur = it.toISOString().substr(0, 16);

      if (!candlesGroupedByTime[cur]) {
        candlesGroupedByTime[cur] = [];
      }
    }

    return candlesGroupedByTime;
  }
);

/** transformResults :: (DbResponse[], request) -> List Maybe t */
const transformResults = (result, request) =>
  compose(
    List,
    map(transformCandle),
    sort((a, b) => new Date(a[0]) - new Date(b[0])),
    toPairs,
    map(concatAll(candleMonoid)),
    addMissingCandles(
      Interval(request.params.interval),
      request.params.timeStart,
      request.params.timeEnd
    ),
    groupBy(candle => {
      return floor(Interval(request.params.interval), candle.time_start)
        .toISOString()
        .substr(0, 16);
    })
  )(result);

module.exports = {
  addMissingCandles,
  transformCandle,
  transformResults,
};
