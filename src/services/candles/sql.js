const pg = require('knex')({ client: 'pg' });

module.exports = ({ amountAsset, priceAsset, params }) =>
  pg('candles')
    .select('*')
    .where('amount_asset_id', amountAsset)
    .where('price_asset_id', priceAsset)
    .where('time_start', '>=', params.timeStart)
    .andWhere('time_start', '<=', params.timeEnd)
    .orderBy('time_start', 'asc')
    .toString();
