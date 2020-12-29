import { Task } from 'folktale/concurrency/task';
import { partition, chain, uniqWith } from 'ramda';
import { BigNumber } from '@waves/data-entities';

import { AssetIdsPair, CacheSync, VolumeAwareRateInfo } from '../../../types';
import {
  pairIsSymmetric,
  pairsEq,
  generatePossibleRequestItems,
} from '../data';
import { RateCacheKey } from './impl/RateCache';

export type RateCache = CacheSync<RateCacheKey, VolumeAwareRateInfo>;

export type AsyncMget<Req, Res, Error> = {
  mget(req: Req): Task<Error, Res[]>;
};

export type PairsForRequest = {
  preComputed: VolumeAwareRateInfo[];
  toBeRequested: AssetIdsPair[];
};

export const partitionByPreComputed = (
  cache: RateCache,
  pairs: AssetIdsPair[],
  getCacheKey: (pair: AssetIdsPair) => RateCacheKey,
  shouldCache: boolean
): PairsForRequest => {
  const [eq, uneq] = partition(pairIsSymmetric, pairs);

  const eqRates: Array<VolumeAwareRateInfo> = eq.map(pair => ({
    rate: new BigNumber(1),
    volumeWaves: new BigNumber(0),
    ...pair,
  }));

  const allPairsToRequest = uniqWith(
    pairsEq,
    chain(it => generatePossibleRequestItems(it), uneq)
  );

  if (shouldCache) {
    const [cached, uncached] = partition(
      it => cache.has(getCacheKey(it)),
      allPairsToRequest
    );

    const cachedRates = cached.map(pair => cache.get(getCacheKey(pair)).unsafeGet());

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
