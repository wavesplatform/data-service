import * as knex from 'knex';
import { interval } from '../../../types';
import { unsafeIntervalsFromStrings } from '../../../utils/interval';
import { highestDividerLessThan } from './utils';
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
  'interval_in_secs',
  'matcher',
];

const FIELDS_WITH_DECIMALS: knex.ColumnName[] = [
  ...FIELDS,
  { a_dec: 'a_dec.decimals' },
  { p_dec: 'p_dec.decimals' },
];

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
  pg('candles')
    .select(FIELDS)
    .where('amount_asset_id', amountAsset)
    .where('price_asset_id', priceAsset)
    .where('time_start', '>=', timeStart)
    .where('time_start', '<=', timeEnd)
    .where('matcher', matcher)
    .where(
      'interval_in_secs',
      // should always be valid after validation
      highestDividerLessThan(
        interval(inter).unsafeGet(),
        unsafeIntervalsFromStrings(DIVIDERS)
      ).matchWith({
        Ok: ({ value: i }) => i.length / 1000,
        Error: ({ value: error }) => interval('1m').unsafeGet().length / 1000,
      })
    );

export const sql = ({
  amountAsset,
  priceAsset,
  timeStart,
  timeEnd,
  interval: inter,
  matcher,
}: CandlesSearchRequest): string =>
  pg('candles')
    .select(FIELDS_WITH_DECIMALS)
    .from({
      c: selectCandles({
        amountAsset,
        priceAsset,
        timeStart,
        timeEnd,
        interval: inter,
        matcher,
      }),
    })
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

export const assetDecimals = (asset: string): string =>
  pg('asset_decimals')
    .select('decimals')
    .where('asset_id', asset)
    .toString();

module.exports = {
  assetDecimals,
  sql,
};
