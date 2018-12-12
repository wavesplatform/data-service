const { compose, pick, map } = require('ramda');
const { renameKeys } = require('ramda-adjunct');
const { List, Pair } = require('../../types');

/** pickPairFields :: Object -> Object */
const pickPairFields = pick([
  'firstPrice',
  'lastPrice',
  'volume',
  'volumeWaves',
]);

/** renamePairFields :: Object -> Object */
const renamePairFields = renameKeys({
  first_price: 'firstPrice',
  last_price: 'lastPrice',
  volume_waves: 'volumeWaves',
});

/** transformResult :: Object -> Object */
const transformResult = compose(
  pickPairFields,
  renamePairFields
);

/** transformResultSearch :: Array -> Object */
const transformResultSearch = compose(
  List,
  map(pair =>
    compose(
      pairObject => ({
        ...pairObject,
        amountAsset: pair.amount_asset_id,
        priceAsset: pair.price_asset_id,
      }),
      Pair,
      pickPairFields,
      renamePairFields
    )(pair)
  )
);

/** transformResult :: Object -> Object */
module.exports = {
  transformResult,
  transformResultSearch,
};
