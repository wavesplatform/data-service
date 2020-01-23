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
import {
  interval,
  list,
  candle,
  List,
  Candle,
  Unit,
  CandleInterval,
} from '../../types';
import { concatAll } from '../../utils/fp/concatAll';
import { floor, ceil, add, trunc } from '../../utils/date';
import { candleMonoid } from './candleMonoid';
import { CandlesSearchRequest } from '.';

const truncToMinutes = trunc(Unit.Minute);
const defaultInterval = interval(CandleInterval.Minute1);

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
  interval: string;
  a_dec: number;
  p_dec: number;
};

export type RawCandle = {
  time_start: Date | null;
  max_height: number;
  open: BigNumber | null;
  high: BigNumber;
  low: BigNumber;
  close: BigNumber | null;
  volume: BigNumber;
  quote_volume: BigNumber;
  weighted_average_price: BigNumber;
  txs_count: number;
  a_dec: number | null;
  p_dec: number | null;
};

export const transformCandle = (candleInterval: string) => ([time, c]: [
  string,
  RawCandle
]): Candle => {
  const isEmpty = (c: RawCandle) => c.txs_count === 0;

  const renameFields = renameKeys({
    quote_volume: 'quoteVolume',
    weighted_average_price: 'weightedAveragePrice',
    max_height: 'maxHeight',
    txs_count: 'txsCount',
    time_start: 'time',
  });

  const timeClose = interval(candleInterval).matchWith({
    Ok: ({ value }) => new Date(new Date(time).valueOf() + value.length - 1),
    Error: () =>
      new Date(
        new Date(time).valueOf() + defaultInterval.unsafeGet().length - 1
      ),
  });

  return compose(
    (c: any): Candle => candle(c),
    assoc('timeClose', timeClose),
    renameFields,
    assoc('time_start', time),
    assoc('txs_count', c.txs_count) as any,
    omit(['a_dec', 'p_dec']),
    ifElse(isEmpty, map(always(null)), identity)
  )(c);
};

/** addMissingCandles :: Interval -> Date -> Date
 * -> Map String CandleDbResponse[]-> Map String CandleDbResponse[] */
export const addMissingCandles = curry(
  (
    interval: Interval,
    timeStart: Date,
    timeEnd: Date
  ) => (candlesGroupedByTime: {
    [date: string]: CandleDbResponse[];
  }): { [date: string]: CandleDbResponse[] } => {
    const end = timeEnd;
    const res = merge({}, candlesGroupedByTime);
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

const candleFixedDecimals = (
  candle: RawCandle,
  aDecimals: number,
  pDecimals: number
) =>
  evolve(
    {
      open: (t: BigNumber | null) =>
        t ? t.decimalPlaces(8 + pDecimals - aDecimals) : null,
      close: (t: BigNumber | null) =>
        t ? t.decimalPlaces(8 + pDecimals - aDecimals) : null,
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
  compose<
    CandleDbResponse[],
    { [date: string]: CandleDbResponse[] },
    { [date: string]: RawCandle[] },
    { [date: string]: RawCandle },
    { [date: string]: RawCandle },
    [string, RawCandle][],
    [string, RawCandle][],
    Candle[],
    List<Candle>
  >(
    list,
    map(transformCandle(request.interval)),
    sort((a, b): number => new Date(a[0]).valueOf() - new Date(b[0]).valueOf()),
    toPairs,
    map<{ [date: string]: RawCandle }, { [date: string]: RawCandle }>(
      (candle: RawCandle) =>
        candle.a_dec && candle.p_dec
          ? candleFixedDecimals(candle, candle.a_dec, candle.p_dec)
          : candle
    ),
    map<{ [date: string]: RawCandle[] }, { [date: string]: RawCandle }>(
      concatAll(candleMonoid)
    ),
    addMissingCandles(
      interval(request.interval).getOrElse(defaultInterval.unsafeGet()),
      request.timeStart,
      request.timeEnd
    ),
    groupBy(candle =>
      truncToMinutes(
        floor(
          interval(request.interval).getOrElse(defaultInterval.unsafeGet()),
          candle.time_start
        )
      )
    )
  )(result);
