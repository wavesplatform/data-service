const {
  compose,
  curryN,
  groupBy,
  map,
  sort,
  toPairs,
  assoc,
  always,
  identity,
  ifElse,
  clone,
  evolve,
  omit,
} = require('ramda');
const { renameKeys } = require('ramda-adjunct');
const { interval, list, candle, Unit } = require('../../types');
const { concatAll } = require('../../utils/fp/concatAll');
const { floor, ceil, add, trunc } = require('../../utils/date');
const { candleMonoid } = require('./candleMonoid');

const truncToMinutes = trunc(Unit.Minute);

/** transformCandle :: [Date, CandleDbResponse] -> Candle */
const transformCandle = ([time, c]) => {
  const isEmpty = c => c.txs_count === 0;

  const renameFields = renameKeys({
    quote_volume: 'quoteVolume',
    weighted_average_price: 'weightedAveragePrice',
    max_height: 'maxHeight',
    txs_count: 'txsCount',
    time_start: 'time',
  });

  return compose(
    candle,
    omit(['a_dec', 'p_dec']),
    renameFields,
    assoc('time_start', new Date(`${time}Z`)),
    assoc('txs_count', c.txs_count),
    ifElse(isEmpty, map(always(null)), identity)
  )(c);
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
      it = floor(interval, add(interval, it))
    ) {
      const cur = truncToMinutes(it);

      if (!res[cur]) {
        res[cur] = [];
      }
    }

    return res;
  }
);

const candleFixedDecimals = (candle, aDecimals, pDecimals) =>
  evolve(
    {
      open: t => t.decimalPlaces(8 + pDecimals - aDecimals),
      close: t => t.decimalPlaces(8 + pDecimals - aDecimals),
      high: t => t.decimalPlaces(8 + pDecimals - aDecimals),
      low: t => t.decimalPlaces(8 + pDecimals - aDecimals),
      volume: t => t.decimalPlaces(aDecimals),
      quote_volume: t => t.decimalPlaces(pDecimals),
      weighted_average_price: t => t.decimalPlaces(8 + pDecimals - aDecimals),
    },
    candle
  );

/** transformResults :: (CandleDbResponse[], request) -> List Maybe t */
const transformResults = (result, request) =>
  compose(
    list,
    map(transformCandle),
    sort((a, b) => new Date(a[0]) - new Date(b[0])),
    toPairs,
    map(candle =>
      candle.a_dec && candle.p_dec
        ? candleFixedDecimals(candle, candle.a_dec, candle.p_dec)
        : candle
    ),
    map(concatAll(candleMonoid)),
    addMissingCandles(
      interval(request.params.interval).getOrElse(null),
      request.params.timeStart,
      request.params.timeEnd
    ),
    groupBy(candle =>
      truncToMinutes(
        floor(
          interval(request.params.interval).getOrElse(null),
          candle.time_start
        )
      )
    )
  )(result);

module.exports = {
  addMissingCandles,
  transformCandle,
  transformResults,
};
