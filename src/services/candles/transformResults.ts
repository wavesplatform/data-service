import { BigNumber } from '@waves/data-entities';
import { Interval } from '../../types';

import {
  compose,
  curry,
  groupBy,
  map,
  sort,
  toPairs,
  assoc,
  always,
  identity,
  ifElse,
  merge,
  evolve,
  omit,
} from 'ramda';
import { renameKeys } from 'ramda-adjunct';
import { interval, list, candle, List, Candle, Unit } from '../../types';
import { concatAll } from '../../utils/fp/concatAll';
import { floor, ceil, add, trunc } from '../../utils/date';
import { candleMonoid } from './candleMonoid';
import { CandlesSearchRequest } from '.';

const truncToMinutes = trunc(Unit.Minute);

export type CandleDbResponse = {
  time_start: Date;
  amount_asset_id: string;
  price_asset_id: string;
  matcher: string;
  max_height: number;
  open: BigNumber;
  high: BigNumber;
  low: BigNumber;
  close: BigNumber;
  volume: BigNumber;
  quote_volume: BigNumber;
  weighted_average_price: BigNumber;
  txs_count: number;
  interval_in_secs: number;
  a_dec: number;
  p_dec: number;
};

/** transformCandle :: [Date, CandleDbResponse] -> Candle */
export const transformCandle = ([time, c]: [
  Date,
  CandleDbResponse
]): Candle => {
  const isEmpty = (c: CandleDbResponse) => c.txs_count === 0;

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
    assoc('time_start', time),
    assoc('txs_count', c.txs_count),
    ifElse(isEmpty, map(always(null)), identity)
  )(c);
};

/** addMissingCandles :: Interval -> Date -> Date
 * -> Map String CandleDbResponse[]-> Map String CandleDbResponse[] */
export const addMissingCandles = curry(
  (
    interval: Interval | null,
    timeStart: Date,
    timeEnd: Date
  ) => (candlesGroupedByTime: {
    [date: string]: CandleDbResponse[];
  }): { [date: string]: CandleDbResponse[] } => {
    const end = timeEnd;
    const res = merge({}, candlesGroupedByTime);
    for (
      let it = ceil(interval, timeStart);
      it < end;
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

const candleFixedDecimals = (
  candle: CandleDbResponse,
  aDecimals: number,
  pDecimals: number
) =>
  evolve(
    {
      open: (t: BigNumber) => t.decimalPlaces(8 + pDecimals - aDecimals),
      close: (t: BigNumber) => t.decimalPlaces(8 + pDecimals - aDecimals),
      high: (t: BigNumber) => t.decimalPlaces(8 + pDecimals - aDecimals),
      low: (t: BigNumber) => t.decimalPlaces(8 + pDecimals - aDecimals),
      volume: (t: BigNumber) => t.decimalPlaces(aDecimals),
      quote_volume: (t: BigNumber) => t.decimalPlaces(pDecimals),
      weighted_average_price: (t: BigNumber) =>
        t.decimalPlaces(8 + pDecimals - aDecimals),
    },
    candle
  );

export const transformResults = (
  result: CandleDbResponse[],
  request: CandlesSearchRequest
): List<Candle> =>
  compose(
    (candles: Candle[]) => list<Candle>(candles),
    map<any, Candle>(transformCandle),
    sort<[string, CandleDbResponse]>(
      (a, b): number => new Date(a[0]).valueOf() - new Date(b[0]).valueOf()
    ),
    (o: { string: CandleDbResponse }) => toPairs(o),
    map((candle: CandleDbResponse) =>
      candle.a_dec && candle.p_dec
        ? candleFixedDecimals(candle, candle.a_dec, candle.p_dec)
        : candle
    ),
    map<CandleDbResponse[], CandleDbResponse>(concatAll(candleMonoid)),
    addMissingCandles(
      interval(request.params.interval).getOrElse(null),
      request.params.timeStart,
      request.params.timeEnd
    ),
    groupBy((candle: CandleDbResponse) =>
      truncToMinutes(
        floor(
          interval(request.params.interval).getOrElse(null),
          candle.time_start
        )
      )
    )
  )(result);
