const { compose, findLast, map, prop, sortBy } = require('ramda');
const Interval = require('../../types/Interval');
const pg = require('knex')({ client: 'pg' });

/** highestDividerLessThen :: Interval i => i -> String[] -> i */
const highestDividerLessThen = (interval, dividers) =>
  compose(
    findLast(i => interval.div(i) >= 1),
    sortBy(prop('length')),
    map(Interval)
  )(dividers);

/** sql :: { String, String, Object } -> String */
const sql = ({ amountAsset, priceAsset, params }) =>
  pg('candles')
    .select('*')
    .where('amount_asset_id', amountAsset)
    .where('price_asset_id', priceAsset)
    .where('time_start', '>=', params.timeStart)
    .where('time_start', '<=', params.timeEnd)
    .where(
      'interval_in_secs',
      highestDividerLessThen(Interval(params.interval), [
        '1m',
        '5m',
        '15m',
        '30m',
        '1h',
        '1d',
      ]).length / 1000
    )
    .orderBy('time_start', 'asc')
    .toString();

module.exports = {
  highestDividerLessThen,
  sql,
};
