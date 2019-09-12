import { isSymmetric } from './util'
import { AssetIdsPair } from '../../types';

export const WavesId: string = 'WAVES';

export const pairIsSymmetric = isSymmetric(
  (p: AssetIdsPair) => [p.amountAsset, p.priceAsset]
);

export const pairHasWaves = (pair: AssetIdsPair): boolean =>
  pair.amountAsset === WavesId || pair.priceAsset === WavesId;

export function flip(pair: AssetIdsPair): AssetIdsPair {
  return {
    amountAsset: pair.priceAsset,
    priceAsset: pair.amountAsset
  }
}
