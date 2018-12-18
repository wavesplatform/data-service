const pg = require('knex')({ client: 'pg' });

/** query :: Array[Object] -> String */
const query = pairs =>
  pg({ t: 'pairs' })
    .select('*')
    .whereIn(
      ['t.amount_asset_id', 't.price_asset_id'],
      pairs.map(pair => [pair.amountAsset, pair.priceAsset])
    )
    .toString();

/** search :: Object -> String */
const search = ({ limit }) =>
  pg({ t: 'pairs' })
    .select('*')
    .orderByRaw('t.volume_waves desc NULLS LAST')
    .limit(limit)
    .toString();

module.exports = {
  /** get :: Object -> String */
  get: pair => query([pair]),
  /** mget :: Array[Object] -> String */
  mget: query,
  search,
};
