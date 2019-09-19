import { AssetIdsPair } from 'types';
import { compose, map, split } from 'ramda';

/**
 * @function
 * @param {string[]} pairs {amoutAsset}/{priceAsset}
 * @returns PairRequest[]
 */
export const parsePairs = (pairsRaw: string[]): AssetIdsPair[] =>
  map(
    compose(
      ([amountAsset, priceAsset]) => ({ amountAsset, priceAsset }),
      split('/')
    ),
    pairsRaw
  );
