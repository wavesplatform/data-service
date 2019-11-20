import * as knex from 'knex';
import { omit, repeat } from 'ramda';
import { Interval, Unit, interval } from '../../../types';
import { add, trunc } from '../../../utils/date';
import {
  fromMilliseconds,
  unsafeIntervalsFromStrings,
  unsafeIntervalsFromStringsReversed,
} from '../../../utils/interval';
import { highestDividerLessThan, numberToUnitsPolynom } from './utils';
import { CandlesSearchRequest } from '..';

const pg = knex({ client: 'pg' });

const FIELDS = {
  time_start: 'c.time_start',
  amount_asset_uid: 'c.amount_asset_uid',
  price_asset_uid: 'c.price_asset_uid',
  low: 'c.low',
  high: 'c.high',
  volume: 'c.volume',
  quote_volume: 'c.quote_volume',
  max_height: 'c.max_height',
  txs_count: 'c.txs_count',
  weighted_average_price: 'c.weighted_average_price',
  open: 'c.open',
  close: 'c.close',
  interval_in_secs: 'c.interval_in_secs',
  matcher_uid: 'c.matcher_uid',
};

const FULL_FIELDS: Record<string, string> = {
  ...omit(['amount_asset_uid', 'price_asset_uid', 'matcher_uid'], FIELDS),
  amount_asset_id: 'a.asset_id',
  price_asset_id: 'p.asset_id',
  matcher: 'addr.address',
  a_dec: 'a.decimals',
  p_dec: 'p.decimals',
};

const DIVIDERS = ['1m', '5m', '15m', '30m', '1h', '3h', '6h', '12h', '1d'];

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
  pg({ c: 'candles' })
    .select(FIELDS)
    .whereIn('amount_asset_uid', function() {
      this.select('uid')
        .from('assets')
        .where('asset_id', amountAsset)
        .limit(1);
    })
    .whereIn('price_asset_uid', function() {
      this.select('uid')
        .from('assets')
        .where('asset_id', priceAsset)
        .limit(1);
    })
    .where('time_start', '>=', timeStart)
    .where('time_start', '<=', timeEnd)
    .whereIn('matcher_uid', function() {
      this.select('uid')
        .from('addresses')
        .where('address', matcher);
    })
    .where(
      'interval_in_secs',
      // should always be valid after validation
      highestDividerLessThan(
        interval(inter).unsafeGet(),
        unsafeIntervalsFromStrings(DIVIDERS)
      ).matchWith({
        Ok: ({ value: i }) => i.length / 1000,
        Error: () => interval('1m').unsafeGet().length / 1000,
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

  return pg({ c: 'candles' })
    .select(FULL_FIELDS)
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
    .innerJoin({ a: 'assets' }, 'a.uid', 'c.amount_asset_uid')
    .innerJoin({ p: 'assets' }, 'p.uid', 'c.price_asset_uid')
    .innerJoin({ addr: 'addresses' }, 'addr.uid', 'c.matcher_uid')
    .orderBy('c.time_start', 'asc')
    .toString();
};

module.exports = {
  periodsToQueries,
  sql,
};
