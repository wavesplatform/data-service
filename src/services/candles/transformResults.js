const {
  compose,
  curryN,
  groupBy,
  map,
  mapObjIndexed,
  sort,
  values,
} = require('ramda');
const { renameKeys } = require('ramda-adjunct');
const { Interval, List } = require('../../types');
const concatAll = require('../../utils/fp/concatAll');
const { floor, ceil, add } = require('../../utils/date');
const { candleMonoid } = require('./candleMonoid');

const transformCandle = ([candle, time]) => {
  let result = {
    time: new Date(time).valueOf(),
    open: null,
    low: null,
    high: null,
    close: null,
    volume: null,
    priceVolume: null,
    weightedAveragePrice: null,
    maxHeight: null,
    txsCount: null,
  };

  if (candle.txs_count) {
    result = {
      ...renameKeys(
        {
          price_volume: 'priceVolume',
          weighted_average_price: 'weightedAveragePrice',
          max_height: 'maxHeight',
          txs_count: 'txsCount',
          time_start: 'time',
        },
        candle
      ),
      time: new Date(candle.time_start).valueOf(),
    };
  }

  return result;
};

// addMissingCandles :: Interval -> String -> String -> {String: [Candle]} -> {String: [Candle]}
const addMissingCandles = curryN(
  4,
  (interval, timeStart, timeEnd, candlesGroupedByTime) => {
    const end = new Date(timeEnd);

    for (
      let it = ceil(interval, new Date(timeStart));
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
    sort((a, b) => {
      const aDate = new Date(a[1]),
        bDate = new Date(b[1]);
      return aDate > bDate ? 1 : aDate < bDate ? -1 : 0;
    }),
    values,
    mapObjIndexed((candle, time) => [candle, time]),
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
