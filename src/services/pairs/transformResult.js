const { compose, pick, map } = require('ramda');
const { renameKeys } = require('ramda-adjunct');
const { list, pair } = require('../../types');

/** pickPairFields :: Object -> Object */
const pickPairFields = pick([
  'firstPrice',
  'lastPrice',
  'low',
  'high',
  'weightedAveragePrice',
  'volume',
  'quoteVolume',
  'volumeWaves',
  'txsCount',
]);

/** renamePairFields :: Object -> Object */
const renamePairFields = renameKeys({
  first_price: 'firstPrice',
  last_price: 'lastPrice',
  volume_waves: 'volumeWaves',
  weighted_average_price: 'weightedAveragePrice',
  quote_volume: 'quoteVolume',
  txs_count: 'txsCount',
});

/** transformResult :: Object -> Object */
const transformResult = compose(
  pickPairFields,
  renamePairFields
);

/** transformResultSearch :: Array -> Object */
const transformResultSearch = compose(
  list,
  map(p =>
    compose(
      pairObject => ({
        ...pairObject,
        amountAsset: p.amount_asset_id,
        priceAsset: p.price_asset_id,
      }),
      pair,
      pickPairFields,
      renamePairFields
    )(p)
  )
);

/** transformResult :: Object -> Object */
module.exports = {
  transformResult,
  transformResultSearch,
};
