import { BigNumber } from '@waves/data-entities';
import {
  compose,
  curry,
  groupBy,
  map,
  sort,
  toPairs,
  merge,
  evolve,
} from 'ramda';
import { Interval, CandleInfo, SearchedItems } from '../../../types';
import { interval, Unit, CandleInterval } from '../../../types';
import { concatAll } from '../../../utils/fp/concatAll';
import { floor, ceil, add, trunc } from '../../../utils/date';
import { candleMonoid } from './candleMonoid';
import { CandlesSearchRequest } from '../repo';

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
]): CandleInfo => {
  const timeClose = interval(candleInterval).matchWith({
    Ok: ({ value }) => new Date(new Date(time).valueOf() + value.length - 1),
    Error: () =>
      new Date(
        new Date(time).valueOf() + defaultInterval.unsafeGet().length - 1
      ),
  });

  return {
    time: new Date(time),
    timeClose,
    txsCount: c.txs_count,
    ...map(v => (c.txs_count === 0 ? null : v), {
      maxHeight: c.max_height,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      volume: c.volume,
      quoteVolume: c.quote_volume,
      weightedAveragePrice: c.weighted_average_price,
    }),
  };
};

/** addMissingCandles :: Interval -> Date -> Date
 * -> Map String CandleDbResponse[]-> Map String CandleDbResponse[] */
export const addMissingCandles = curry(
  (interval: Interval, timeStart: Date, timeEnd: Date) => (
    candlesGroupedByTime: Record<string, CandleDbResponse[]>
  ): Record<string, CandleDbResponse[]> => {
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
): SearchedItems<CandleInfo> =>
  compose<
    CandleDbResponse[],
    Record<string, CandleDbResponse[]>,
    Record<string, RawCandle[]>,
    Record<string, RawCandle>,
    Record<string, RawCandle>,
    [string, RawCandle][],
    [string, RawCandle][],
    CandleInfo[],
    SearchedItems<CandleInfo>
  >(
    items => ({
      items: items,
      isLastPage: false,
    }),
    map(transformCandle(request.interval)),
    sort((a, b): number => new Date(a[0]).valueOf() - new Date(b[0]).valueOf()),
    toPairs,
    map<Record<string, RawCandle>, Record<string, RawCandle>>(
      (candle: RawCandle) =>
        candle.a_dec && candle.p_dec
          ? candleFixedDecimals(candle, candle.a_dec, candle.p_dec)
          : candle
    ),
    map<Record<string, RawCandle[]>, Record<string, RawCandle>>(
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
