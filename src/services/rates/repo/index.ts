import { partition, chain, uniqWith } from 'ramda';
import { AssetIdsPair, CacheSync } from '../../../types';
import { BigNumber } from '@waves/data-entities';
import {
  pairIsSymmetric,
  pairsEq,
  generatePossibleRequestItems,
} from '../data';
import { RateCacheKey } from './impl/RateCache';
import { VolumeAwareRateInfo } from '../RateEstimator';
import { Task } from 'folktale/concurrency/task';
import { RateWithPairIds } from '../../rates';

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
  shouldCache: boolean,
): PairsForRequest => {
  const [eq, uneq] = partition(pairIsSymmetric, pairs);

  const eqRates: Array<RateWithPairIds> = eq.map((pair) => ({
    rate: new BigNumber(1),
    ...pair,
  }));

  const allPairsToRequest = uniqWith(
    pairsEq,
    chain((it) => generatePossibleRequestItems(it), uneq)
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
