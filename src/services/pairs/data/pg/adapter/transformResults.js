const { curry } = require('ramda');

const { convertPrice, convertAmount } = require('../../../../../utils/satoshi');

const WAVES_DECIMALS = 8;

/**
 * @typedef {object} PairDbResponse
 * @property {BigNumber} a_decimals
 * @property {BigNumber} p_decimals
 * @property {BigNumber} first_price
 * @property {BigNumber} last_price
 * @property {BigNumber} volume
 * @property {BigNumber} volume_price_asset
 * @property {BigNumber} [avg_price_with_waves]
 * @property {BigNumber} [price_asset_with_waves]
 */

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
  if (result === null) return null;

  const {
    a_decimals: aDecimals,
    p_decimals: pDecimals,
    last_price: lastPrice,
    first_price: firstPrice,
    volume,
    volume_price_asset: volumePriceAsset,
    ...withWaves
  } = result;

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
      return {
        ...resultCommon,
        volume_waves: convertAmount(WAVES_DECIMALS, volumePriceAsset),
      };
    }
    default: {
      const {
        avg_price_with_waves: avgPriceWithWaves,
        price_asset_with_waves: priceAssetWithWaves,
      } = withWaves;

      if (avgPriceWithWaves === null)
        return {
          ...resultCommon,
          volume_waves: null,
        };

      const volumeConverted = convertAmount(pDecimals, volumePriceAsset);

      if (priceAssetWithWaves === 'WAVES') {
        const priceConverted = convertPrice(
          pDecimals,
          WAVES_DECIMALS,
          avgPriceWithWaves
        );
        return {
          ...resultCommon,
          volume_waves: volumeConverted.multipliedBy(priceConverted),
        };
      } else {
        const priceConverted = convertPrice(
          WAVES_DECIMALS,
          pDecimals,
          avgPriceWithWaves
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
