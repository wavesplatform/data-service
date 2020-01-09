import { fromNullable } from 'folktale/maybe';
import * as LRU from 'lru-cache';

import { AssetsCache, AssetDbResponse } from './types';

export const create = (size: number, maxAgeMillis: number): AssetsCache => {
  const cache = new LRU<string, AssetDbResponse>({
    max: size,
    maxAge: maxAgeMillis,
  });

  return {
    has: key => {
      return cache.has(key);
    },
    get: key => fromNullable(cache.get(key)),
    set: (key, value) => {
      cache.set(key, value);
    },
  };
};
