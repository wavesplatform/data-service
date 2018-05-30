const { renameKeys } = require('ramda-adjunct');
const { compose } = require('ramda');

/** transformPairInfo:: RawPairInfo -> PairInfo */
const transformPairInfo = compose(
  renameKeys({
    last_price: 'lastPrice',
    first_price: 'firstPrice',
    amount_asset: 'amountAsset',
    price_asset: 'priceAsset'
  })
);

module.exports = { transformPairInfo };
