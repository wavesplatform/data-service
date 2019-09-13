import { fromNullable } from 'folktale/maybe';

import { CacheSync } from '../../types';
import { PairDbResponse } from './transformResult';

import * as LRU from 'lru-cache';
import { PairsGetRequest } from '.';

export const create = (
  size: number,
  maxAgeMillis: number
): CacheSync<PairsGetRequest, PairDbResponse> => {
  const cache = new LRU<string, PairDbResponse>({
    max: size,
    maxAge: maxAgeMillis,
  });

  const toStringKey = (req: PairsGetRequest): string =>
    req.matcher + req.pair.amountAsset + req.pair.priceAsset;

  return {
    has: key => {
      const k = toStringKey(key);
      return cache.has(k);
    },
    get: key => {
      const k = toStringKey(key);
      const p = cache.get(k);
      return fromNullable(p);
    },
    set: (key, value) => {
      const k = toStringKey(key);
      cache.set(k, value);
    },
  };
};
