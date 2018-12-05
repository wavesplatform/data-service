const { prop, and, equals } = require('ramda');

module.exports = {
  /** matchPairs :: (Object, Object) -> Boolean */
  matchPairs: (request, result) =>
    and(
      equals(prop('amount_asset_id', result), prop('amountAsset', request)),
      equals(prop('price_asset_id', result), prop('priceAsset', request))
    ),
};
