import { isSymmetric } from './util';
import { AssetIdsPair } from '../../types';

export const WavesId: string = 'WAVES';

export const pairIsSymmetric = isSymmetric((p: AssetIdsPair) => [
  p.amountAsset,
  p.priceAsset,
]);

export const pairHasWaves = (pair: AssetIdsPair): boolean =>
  pair.amountAsset === WavesId || pair.priceAsset === WavesId;

export function flip(pair: AssetIdsPair): AssetIdsPair {
  return {
    amountAsset: pair.priceAsset,
    priceAsset: pair.amountAsset,
  };
}

export const pairsEq = (pair1: AssetIdsPair, pair2: AssetIdsPair): boolean =>
  pair1.amountAsset === pair2.amountAsset &&
  pair1.priceAsset === pair2.priceAsset;

export function generatePossibleRequestItems(
  pair: AssetIdsPair
): AssetIdsPair[] {
  if (pair.amountAsset === WavesId || pair.priceAsset === WavesId) {
    return [pair, flip(pair)];
  }

  const wavesL: AssetIdsPair = {
    amountAsset: pair.amountAsset,
    priceAsset: WavesId,
  };

  const wavesR: AssetIdsPair = {
    amountAsset: pair.priceAsset,
    priceAsset: WavesId,
  };

  return [pair, flip(pair), wavesL, flip(wavesL), wavesR, flip(wavesR)];
}
