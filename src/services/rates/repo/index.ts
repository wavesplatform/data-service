import { Maybe } from 'folktale/maybe';
import { partition, chain, uniqWith } from 'ramda';
import { AssetIdsPair, RateInfo } from '../../../types';
import { BigNumber } from '@waves/data-entities';
import {
  pairIsSymmetric,
  pairsEq,
  generatePossibleRequestItems,
} from '../data';
import { RateCacheKey } from './impl/RateCache';
import { Task } from 'folktale/concurrency/task';

// @todo (next task) generalize/reuse
export type ReadOnlyCache<K, V> = {
  has: (key: K) => boolean;
  get: (key: K) => Maybe<V>;
};

export type Cache<K, V> = ReadOnlyCache<K, V> & {
  put: (key: K, value: V) => void;
};

export type AsyncGet<Req, Res, Error> = {
  get(req: Req): Task<Error, Res>;
};

export type AsyncMget<Req, Res, Error> = {
  mget(req: Req): Task<Error, Res[]>;
};

export type PairsForRequest = {
  preCount: RateInfo[];
  toBeRequested: AssetIdsPair[];
};

export const partitionByPreCount = (
  cache: Cache<Maybe<RateCacheKey>, BigNumber>,
  pairs: AssetIdsPair[],
  getCacheKey: (pair: AssetIdsPair) => Maybe<RateCacheKey>
): PairsForRequest => {
  const [eq, uneq] = partition(pairIsSymmetric, pairs);

  const allPairsToRequest = uniqWith(
    pairsEq,
    chain(it => generatePossibleRequestItems(it), uneq)
  );

  const [cached, uncached] = partition(
    it => cache.has(getCacheKey(it)),
    allPairsToRequest
  );

  const cachedRates: RateInfo[] = cached.map(pair => ({
    amountAsset: pair.amountAsset,
    priceAsset: pair.priceAsset,
    current: cache.get(getCacheKey(pair)).getOrElse(new BigNumber(0)),
  }));

  const eqRates: RateInfo[] = eq.map(pair => ({
    current: new BigNumber(1),
    ...pair,
  }));

  return {
    preCount: cachedRates.concat(eqRates),
    toBeRequested: uncached,
  };
};
