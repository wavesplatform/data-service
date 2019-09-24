import { AssetIdsPair } from '../../types';
import { compose, map, split } from 'ramda';

export const parsePairs = (pairsRaw: string[]): AssetIdsPair[] =>
  map(
    compose(
      ([amountAsset, priceAsset]) => ({ amountAsset, priceAsset }),
      split('/')
    ),
    pairsRaw
  );
