import * as knex from 'knex';
import { repeat } from 'ramda';
import { Interval, Unit, interval, CandleInterval } from '../../../types';
import { add, trunc } from '../../../utils/date';
import {
  fromMilliseconds,
  unsafeIntervalsFromStrings,
  unsafeIntervalsFromStringsReversed,
} from '../../../utils/interval';
import { highestDividerLessThan, numberToUnitsPolynom } from './utils';
import { CandlesSearchRequest } from '..';

const pg = knex({ client: 'pg' });

const FIELDS = [
  'time_start',
  'amount_asset_id',
  'price_asset_id',
  'low',
  'high',
  'volume',
  'quote_volume',
  'max_height',
  'txs_count',
  'weighted_average_price',
  'open',
  'close',
  'interval',
  'matcher',
];

const FIELDS_WITH_DECIMALS: knex.ColumnName[] = [
  ...FIELDS,
  { a_dec: 'a_dec.decimals' },
  { p_dec: 'p_dec.decimals' },
];

const DIVIDERS = [
  CandleInterval.Minute1,
  CandleInterval.Minute5,
  CandleInterval.Minute15,
  CandleInterval.Minute30,
  CandleInterval.Hour1,
  CandleInterval.Hour2,
  CandleInterval.Hour3,
  CandleInterval.Hour4,
  CandleInterval.Hour6,
  CandleInterval.Hour12,
  CandleInterval.Day1,
  CandleInterval.Week1,
  CandleInterval.Month1,
];

export interface CandleSelectionParams {
  amountAsset: string;
  priceAsset: string;
  timeStart: Date;
  timeEnd: Date;
  interval: string;
  matcher: string;
}

export const selectCandles = ({
  amountAsset,
  priceAsset,
  timeStart,
  timeEnd,
  matcher,
  interval: inter,
}: CandleSelectionParams): knex.QueryBuilder =>
  pg('candles')
    .select(FIELDS)
    .where('amount_asset_id', amountAsset)
    .where('price_asset_id', priceAsset)
    .where('time_start', '>=', timeStart)
    .where('time_start', '<=', timeEnd)
    .where('matcher', matcher)
    .where(
      'interval',
      // should always be valid after validation
      highestDividerLessThan(
        interval(inter).unsafeGet(),
        unsafeIntervalsFromStrings(DIVIDERS)
      ).matchWith({
        Ok: ({ value: i }) => i.source,
        Error: ({ value: error }) => CandleInterval.Minute1,
      })
    );

export const periodsToQueries = ({
  amountAsset,
  priceAsset,
  timeStart,
  periods,
  matcher,
}: {
  amountAsset: string;
  priceAsset: string;
  timeStart: Date;
  periods: Interval[];
  matcher: string;
}): knex.QueryBuilder[] => {
  const queries: knex.QueryBuilder[] = [];

  let itTimestamp = new Date(trunc(Unit.Minute, timeStart)).getTime();

  periods.forEach(period => {
    const timeEnd = add(period, new Date(itTimestamp));

    queries.push(
      selectCandles({
        amountAsset,
        priceAsset,
        matcher,
        timeStart: new Date(itTimestamp),
        timeEnd: timeEnd,
        interval: period.source,
      }).limit(1)
    );

    itTimestamp = timeEnd.getTime();
  });

  return queries;
};

export const sql = ({
  amountAsset,
  priceAsset,
  timeStart,
  timeEnd,
  interval: inter,
  matcher,
}: CandlesSearchRequest): string => {
  // should always be valid after validation
  const paramsInterval = interval(inter).unsafeGet();

  const ts = new Date(trunc(paramsInterval.unit, timeEnd));
  const te = new Date(trunc(Unit.Minute, timeEnd));
  const periodInMinutes = (te.getTime() - ts.getTime()) / (1000 * 60);

  const periodsForQueries = numberToUnitsPolynom(
    unsafeIntervalsFromStringsReversed(DIVIDERS).map(
      i => i.length / (1000 * 60)
    ),
    periodInMinutes
  ).reduce<Interval[]>(
    (periods, polynom) => [
      ...periods,
      ...repeat(
        fromMilliseconds(polynom[0] * 1000 * 60).unsafeGet(),
        polynom[1]
      ),
    ],
    []
  );

  return pg('candles')
    .select(FIELDS_WITH_DECIMALS)
    .from(
      selectCandles({
        amountAsset,
        priceAsset,
        timeStart,
        timeEnd,
        interval: inter,
        matcher,
      })
        .union(
          periodsToQueries({
            amountAsset,
            priceAsset,
            timeStart: ts,
            periods: periodsForQueries,
            matcher,
          }),
          true
        )
        .as('c')
    )
    .innerJoin(
      { a_dec: 'asset_decimals' },
      'c.amount_asset_id',
      'a_dec.asset_id'
    )
    .innerJoin(
      { p_dec: 'asset_decimals' },
      'c.price_asset_id',
      'p_dec.asset_id'
    )
    .orderBy('c.time_start', 'asc')
    .toString();
};

export const assetDecimals = (asset: string): string =>
  pg('asset_decimals')
    .select('decimals')
    .where('asset_id', asset)
    .toString();

module.exports = {
  assetDecimals,
  periodsToQueries,
  sql,
};
