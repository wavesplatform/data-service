const { compose, pick, map, repeat, zipObj } = require('ramda');
const { renameKeys } = require('ramda-adjunct');
const { list, pair } = require('../../types');

const pairDataFields = [
  'firstPrice',
  'lastPrice',
  'low',
  'high',
  'weightedAveragePrice',
  'volume',
  'quoteVolume',
  'volumeWaves',
  'txsCount',
];

/** pickPairFields :: Object -> Object */
const pickPairFields = pick(pairDataFields);

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
      transformResult
    )(p)
  )
);

const createEmptyPair = () =>
  pair(zipObj(pairDataFields, repeat(null, pairDataFields.length)));

/** transformResult :: Object -> Object */
module.exports = {
  transformResult,
  transformResultSearch,
  createEmptyPair,
};
