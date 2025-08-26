import * as knex from 'knex';
import { CandleInterval, Interval } from '../../../../types';
import { unsafeIntervalsFromStrings } from '../../../../utils/interval';
import { highestDividerLessThan } from './utils';
import { CandlesSearchRequest } from '../../repo';

const pg = knex({ client: 'pg' });

const FIELDS = {
  time_start: 'c.time_start',
  amount_asset_id: 'c.amount_asset_id',
  price_asset_id: 'c.price_asset_id',
  low: pg.raw('(c.low)::numeric'),
  high: pg.raw('(c.high)::numeric'),
  volume: pg.raw('(c.volume)::numeric'),
  quote_volume: pg.raw('(c.quote_volume)::numeric'),
  max_height: 'c.max_height',
  txs_count: 'c.txs_count',
  weighted_average_price: pg.raw('(c.weighted_average_price)::numeric'),
  open: pg.raw('(c.open)::numeric'),
  close: pg.raw('(c.close)::numeric'),
  interval: 'c.interval',
};

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
  interval: Interval;
  matcher: string;
}

export const selectCandles = ({
  amountAsset,
  priceAsset,
  timeStart,
  timeEnd,
  matcher,
  interval,
}: CandleSelectionParams): knex.QueryBuilder =>
  pg({ c: 'candles' })
    .select(FIELDS)
    .where('amount_asset_id', amountAsset)
    .where('price_asset_id', priceAsset)
    .where('time_start', '>=', timeStart.toISOString())
    .where('time_start', '<=', timeEnd.toISOString())
    .where('matcher_address', matcher)
    .where(
      'interval',
      // should always be valid after validation
      highestDividerLessThan(interval, unsafeIntervalsFromStrings(DIVIDERS)).matchWith({
        Ok: ({ value: i }) => i.source,
        Error: ({ value: error }) => CandleInterval.Minute1,
      })
    );

export const search = ({
  amountAsset,
  priceAsset,
  timeStart,
  timeEnd,
  interval,
  matcher,
}: CandlesSearchRequest): string =>
  pg('candles')
    .select(FIELDS)
    .from({
      c: selectCandles({
        amountAsset,
        priceAsset,
        timeStart,
        timeEnd,
        interval,
        matcher,
      }),
    })
    .orderBy('c.time_start', 'asc')
    .toString();

export const selectLastCandle = ({
  amountAsset,
  priceAsset,
  timeEnd,
  matcher,
  interval,
}: CandleSelectionParams): knex.QueryBuilder =>
  pg({ c: 'candles' })
  .select(FIELDS)
  .where('amount_asset_id', amountAsset)
  .where('price_asset_id', priceAsset)
  .where('time_start', '<=', timeEnd.toISOString())
  .where('matcher_address', matcher)
  .where('txs_count', '>', 0)
  .where(
    'interval',
    // should always be valid after validation
    highestDividerLessThan(interval, unsafeIntervalsFromStrings(DIVIDERS)).matchWith({
      Ok: ({ value: i }) => i.source,
      Error: ({ value: error }) => CandleInterval.Minute1,
    })
  )
;

export const searchLast = ({
  amountAsset,
  priceAsset,
  timeStart,
  timeEnd,
  interval,
  matcher,
}: CandlesSearchRequest): string =>
  pg('candles')
    .select(FIELDS)
    .from({
      c: selectLastCandle({
        amountAsset,
        priceAsset,
        timeStart,
        timeEnd,
        interval,
        matcher,
      }),
    })
    .orderBy('c.time_start', 'desc')
    .limit(1)
    .toString();

export const sql = {
  search,
  searchLast
}

module.exports = {
  sql,
};
