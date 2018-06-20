const { head, curry } = require('ramda');

const { convertPrice, convertAmount } = require('../../../utils/satoshi');

const WAVES_DECIMALS = 8;

/**
 * @typedef {object} PairInfoRaw
 * @property {BigNumber} first_price
 * @property {BigNumber} last_price
 * @property {BigNumber} volume
 * @property {BigNumber} volume_waves
 */

/**
 * DB task returns array of values:
 * [aDecimals, pDecimals, firstPrice, lastPrice, volume, -volumeInPriceAsset, -avgPriceWithWaves]
 * depending on pair (does it have WAVES and if does, in which position)
 * Possible cases:
 *  1. WAVES — amount asset. Volume in waves = volume
 *  2. WAVES — price asset. Volume in waves = volume_in_price_asset
 *  3. WAVES is not in pair
 *    3a. Correct pair WAVES/priceAsset. Volume in waves = volume_in_price_asset / avg_price to WAVES
 *    3b. Correct pair priceAsset/WAVES. Volume in waves = volume_in_price_asset * avg_price to WAVES
 * @typedef {function} transformResults
 * @returns PairInfoRaw
 */
const transformResults = curry(({ amountAsset, priceAsset }, result) => {
  if (result.slice(0, 4).some(x => x === null)) return null;
  if (result[4].volume === null) return null;

  const [
    { decimals: aDecimals },
    { decimals: pDecimals },
    { price: firstPrice },
    { price: lastPrice },
    { volume },
    ...tail
  ] = result;

  const resultCommon = {
    first_price: convertPrice(aDecimals, pDecimals, firstPrice),
    last_price: convertPrice(aDecimals, pDecimals, lastPrice),
    volume: convertAmount(aDecimals, volume),
  };

  switch (true) {
    case amountAsset === 'WAVES':
      return {
        ...resultCommon,
        volume_waves: resultCommon.volume,
      };
    case priceAsset === 'WAVES': {
      const { volume_price_asset: volumePriceAsset } = head(tail);
      return {
        ...resultCommon,
        volume_waves: convertAmount(8, volumePriceAsset),
      };
    }
    default: {
      const [
        { volume_price_asset: volumePriceAsset },
        { price_asset, avg_price },
      ] = tail;

      if (avg_price === null)
        return {
          ...resultCommon,
          volume_waves: null,
        };

      const volumeConverted = convertAmount(pDecimals, volumePriceAsset);

      if (price_asset === 'WAVES') {
        const priceConverted = convertPrice(
          pDecimals,
          WAVES_DECIMALS,
          avg_price
        );
        return {
          ...resultCommon,
          volume_waves: volumeConverted.multipliedBy(priceConverted),
        };
      } else {
        const priceConverted = convertPrice(
          WAVES_DECIMALS,
          pDecimals,
          avg_price
        );
        return {
          ...resultCommon,
          volume_waves: volumeConverted.dividedBy(priceConverted),
        };
      }
    }
  }
});

module.exports = transformResults;
