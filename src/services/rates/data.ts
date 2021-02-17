import { Asset } from '@waves/data-entities';

import { WavesId } from '../..';

import { AssetPair } from './RateEstimator';
import { isSymmetric } from './util';

export const pairIsSymmetric = isSymmetric((p: AssetPair) => [
  p.amountAsset,
  p.priceAsset,
]);

export const pairHasWaves = (pair: AssetPair): boolean =>
  pair.amountAsset.id === WavesId || pair.priceAsset.id === WavesId;

export function flip<T extends AssetPair>(pair: T): T {
  return {
    ...pair,
    amountAsset: pair.priceAsset,
    priceAsset: pair.amountAsset,
  };
}

export const pairsEq = (pair1: AssetPair, pair2: AssetPair): boolean =>
  pair1.amountAsset.id === pair2.amountAsset.id &&
  pair1.priceAsset.id === pair2.priceAsset.id;

export function createGeneratePossibleRequestItems(
  wavesAsset: Asset
): (pair: AssetPair) => AssetPair[] {
  return (pair: AssetPair): AssetPair[] => {
    if (pairHasWaves(pair)) {
      return [pair, flip(pair)];
    }

    const wavesL: AssetPair = {
      amountAsset: pair.amountAsset,
      priceAsset: wavesAsset,
    };

    const wavesR: AssetPair = {
      amountAsset: pair.priceAsset,
      priceAsset: wavesAsset,
    };

    return [wavesL, flip(wavesL), wavesR, flip(wavesR), pair, flip(pair)];
  };
}
