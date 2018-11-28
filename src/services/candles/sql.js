const { findLast, map, pipe, prop, sortBy } = require('ramda');
const Interval = require('../../types/Interval');

const pg = require('knex')({ client: 'pg' });

/** highestDividerLessThen :: Interval i => i -> String[] -> i */
const highestDividerLessThen = (interval, dividers) =>
  pipe(
    map(Interval),
    sortBy(pipe(prop('length'))),
    findLast(i => interval.div(i) > 1),
    Interval
  )(dividers);

/** sql :: { String, String, Object } -> String */
module.exports = ({ amountAsset, priceAsset, params }) =>
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
