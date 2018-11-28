const Interval = require('../../types/Interval');
const pg = require('knex')({ client: 'pg' });

module.exports = ({ amountAsset, priceAsset, params }) =>
  pg('candles')
    .select('*')
    .where('amount_asset_id', amountAsset)
    .where('price_asset_id', priceAsset)
    .where('time_start', '>=', params.timeStart)
    .where('time_start', '<=', params.timeEnd)
    .where('fold', Interval(params.interval).closest(['1m', '5m', '15m', '30m', '1h', '1d']).length / 1000)
    .orderBy('time_start', 'asc')
    .toString();
