const { prop, and, equals } = require('ramda');

/** matchPairs :: (Object, Object) -> Boolean */
module.exports = (request, result) =>
  and(
    equals(prop('amount_asset_id', result), prop('amountAsset', request)),
    equals(prop('price_asset_id', result), prop('priceAsset', request))
  );
