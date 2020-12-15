import { Task } from 'folktale/concurrency/task';
import { partition, chain, uniqWith } from 'ramda';
import { BigNumber } from '@waves/data-entities';

import { AssetIdsPair, CacheSync, EstimationReadyRateInfo } from '../../../types';
import {
  pairIsSymmetric,
  pairsEq,
  generatePossibleRequestItems,
} from '../data';
import { RateCacheKey } from './impl/RateCache';

export type RateCache = CacheSync<RateCacheKey, EstimationReadyRateInfo>;

export type AsyncMget<Req, Res, Error> = {
  mget(req: Req): Task<Error, Res[]>;
};

export type PairsForRequest = {
  preCount: EstimationReadyRateInfo[];
  toBeRequested: AssetIdsPair[];
};

export const partitionByPreCount = (
  cache: RateCache,
  pairs: AssetIdsPair[],
  getCacheKey: (pair: AssetIdsPair) => RateCacheKey,
  shouldCache: boolean
): PairsForRequest => {
  const [eq, uneq] = partition(pairIsSymmetric, pairs);

  const eqRates: Array<EstimationReadyRateInfo> = eq.map(pair => ({
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
      preCount: cachedRates.concat(eqRates),
      toBeRequested: uncached,
    };
  } else {
    return {
      preCount: eqRates,
      toBeRequested: allPairsToRequest,
    };
  }
};
