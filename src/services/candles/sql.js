const { compose, findLast, map, prop, sortBy } = require('ramda');
const { interval, intervalDiv } = require('../../types');
const pg = require('knex')({ client: 'pg' });

const fields = [
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
  { a_dec: 'a_dec.decimals' },
  { p_dec: 'p_dec.decimals' },
];

/** highestDividerLessThen :: Interval i => i -> String[] -> i */
const highestDividerLessThen = (inter, dividers) =>
  compose(
    findLast(i => intervalDiv(inter, i) >= 1),
    sortBy(prop('length')),
    map(d => interval(d).getOrElse(null))
  )(dividers);

/** sql :: { String, String, Object } -> String */
const sql = ({ amountAsset, priceAsset, params }) =>
  pg('candles')
    .select(fields)
    .where('amount_asset_id', amountAsset)
    .where('price_asset_id', priceAsset)
    .where('time_start', '>=', params.timeStart)
    .where('time_start', '<=', params.timeEnd)
    .where(
      'interval_in_secs',
      highestDividerLessThen(interval(params.interval).getOrElse(null), [
        '1m',
        '5m',
        '15m',
        '30m',
        '1h',
        '3h',
        '6h',
        '12h',
        '1d',
      ]).length / 1000
    )
    .innerJoin({ a_dec: 'asset_decimals' }, 'amount_asset_id', 'a_dec.asset_id')
    .innerJoin({ p_dec: 'asset_decimals' }, 'price_asset_id', 'p_dec.asset_id')
    .orderBy('time_start', 'asc')
    .toString();

/** sql :: String -> String */
const assetDecimals = asset =>
  pg('asset_decimals')
    .select('decimals')
    .where('asset_id', asset)
    .toString();

module.exports = {
  highestDividerLessThen,
  assetDecimals,
  sql,
};
