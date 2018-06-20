const { curry } = require('ramda');

/**
  cases:
  1. WAVES — amount asset. Volume in waves = volume
  2. WAVES — price asset. Volume in waves = volume_in_price_asset
  3. WAVES is not in pair
    3a. Correct pair WAVES/priceAsset. Volume in waves = volume_in_price_asset / avg_price to WAVES
    3b. Correct pair priceAsset/WAVES. Volume in waves = volume_in_price_asset * avg_price to WAVES
 */
const batchQueries = curry(
  (
    {
      volume,
      firstPrice,
      lastPrice,
      volumeInPriceAsset,
      decimals,
      weightedAveragePrice,
    },
    pair,
    t
  ) => {
    const { priceAsset, amountAsset } = pair;

    const batch = (t, qs) => t.batch(qs.map(t.oneOrNone));
    const commonQs = [
      decimals(amountAsset),
      decimals(priceAsset),
      firstPrice(pair),
      lastPrice(pair),
      volume(pair),
    ];

    switch (true) {
      case amountAsset === 'WAVES':
        return batch(t, commonQs);
      case priceAsset === 'WAVES':
        return batch(t, [...commonQs, volumeInPriceAsset(pair)]);
      default:
        return batch(t, [
          ...commonQs,
          volumeInPriceAsset(pair),
          weightedAveragePrice({ asset1: priceAsset, asset2: 'WAVES' }),
        ]);
    }
  }
);

module.exports = batchQueries;
