const {
  compose,
  curryN,
  groupBy,
  map,
  sort,
  toPairs,
  assoc,
  always,
  ifElse,
  clone,
  evolve,
} = require('ramda');
const { renameKeys } = require('ramda-adjunct');
const { Interval, List } = require('../../types');
const concatAll = require('../../utils/fp/concatAll');
const { floor, ceil, add } = require('../../utils/date');
const { candleMonoid } = require('./candleMonoid');

/** transformCandle :: [Date, CandleDbResponse] -> Candle */
const transformCandle = ([time, candle]) => {
  const isEmpty = c => c.txs_count === 0;

  const transformEmpty = c =>
    compose(
      assoc('time_start', new Date(time)),
      map(always(null))
    )(c);

  const renameFields = renameKeys({
    price_volume: 'priceVolume',
    weighted_average_price: 'weightedAveragePrice',
    max_height: 'maxHeight',
    txs_count: 'txsCount',
    time_start: 'time',
  });

  return compose(
    renameFields,
    ifElse(isEmpty, transformEmpty, evolve({ time_start: t => new Date(t) }))
  )(candle);
};

/** addMissingCandles :: Interval -> Date -> Date
 * -> Map String CandleDbResponse[]-> Map String CandleDbResponse[] */
const addMissingCandles = curryN(
  4,
  (interval, timeStart, timeEnd, candlesGroupedByTime) => {
    const end = timeEnd;
    const res = clone(candlesGroupedByTime);

    for (
      let it = ceil(interval, timeStart);
      it <= end;
      it = add(interval, it)
    ) {
      const cur = it.toISOString().substr(0, 16);

      if (!res[cur]) {
        res[cur] = [];
      }
    }

    return res;
  }
);

/** transformResults :: (CandleDbResponse[], request) -> List Maybe t */
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
