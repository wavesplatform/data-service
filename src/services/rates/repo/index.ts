import { Task } from 'folktale/concurrency/task';
import { partition, chain, uniqWith } from 'ramda';
import { Asset, BigNumber } from '@waves/data-entities';

import { CacheSync } from '../../../types';
import {
  pairIsSymmetric,
  pairsEq,
  createGeneratePossibleRequestItemsWithAsset,
} from '../data';
import { RateCacheKey } from './impl/RateCache';
import { AssetPair, VolumeAwareRateInfo } from '../RateEstimator';

export type RateCache = CacheSync<RateCacheKey, VolumeAwareRateInfo>;

export type AsyncMget<Req, Res, Error> = {
  mget(req: Req): Task<Error, Res[]>;
};

export type PairsForRequest = {
  preComputed: VolumeAwareRateInfo[];
  toBeRequested: AssetPair[];
};

export const partitionByPreComputed = (
  cache: RateCache,
  pairs: AssetPair[],
  getCacheKey: (pair: AssetPair) => RateCacheKey,
  shouldCache: boolean,
  baseAsset: Asset
): PairsForRequest => {
  const generatePossibleRequestItems =
    createGeneratePossibleRequestItemsWithAsset(baseAsset);
  // pair is symmetric if amountAsset == priceAsset
  // therefore rate = 1, volume = 0
  const [symmetric, asymmetric] = partition(pairIsSymmetric, pairs);

  const eqRates: Array<VolumeAwareRateInfo> = symmetric.map((pair) => ({
    rate: new BigNumber(1),
    volumeWaves: new BigNumber(0),
    ...pair,
  }));

  const allPairsToRequest = uniqWith(
    pairsEq,
    chain((it) => generatePossibleRequestItems(it), asymmetric)
  );

  if (shouldCache) {
    const [cached, uncached] = partition(
      (it) => cache.has(getCacheKey(it)),
      allPairsToRequest
    );

    const cachedRates = cached.map((pair) => cache.get(getCacheKey(pair)).unsafeGet());
    return {
      preComputed: cachedRates.concat(eqRates),
      toBeRequested: uncached,
    };
  } else {
    return {
      preComputed: eqRates,
      toBeRequested: allPairsToRequest,
    };
  }
};
