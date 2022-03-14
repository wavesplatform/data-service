import { Asset } from '@waves/data-entities';

import { AssetPair } from './RateEstimator';
import { isSymmetric } from './util';

export const pairIsSymmetric = isSymmetric((p: AssetPair) => [
  p.amountAsset,
  p.priceAsset,
]);

export const createPairHasBaseAsset =
  (baseAssetId: string) =>
  (pair: AssetPair): boolean =>
    pair.amountAsset.id === baseAssetId || pair.priceAsset.id === baseAssetId;

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

export function createGeneratePossibleRequestItemsWithAsset(
  baseAsset: Asset
): (pair: AssetPair) => AssetPair[] {
  const pairHasBaseAsset = createPairHasBaseAsset(baseAsset.id);
  return (pair: AssetPair): AssetPair[] => {
    if (pairHasBaseAsset(pair)) {
      return [pair, flip(pair)];
    }

    const wavesL: AssetPair = {
      amountAsset: pair.amountAsset,
      priceAsset: baseAsset,
    };

    const wavesR: AssetPair = {
      amountAsset: pair.priceAsset,
      priceAsset: baseAsset,
    };

    return [wavesL, flip(wavesL), wavesR, flip(wavesR), pair, flip(pair)];
  };
}
