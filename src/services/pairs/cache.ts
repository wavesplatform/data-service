import { of as task, rejected } from 'folktale/concurrency/task';
import { of as just, empty as nothing } from 'folktale/maybe';

import { Cache } from '../../types';
import { PairDbResponse } from './transformResult';

import * as LRU from 'lru-cache';
import { PairsGetRequest } from '.';

export const cache = (
  size: number,
  maxAgeMillis: number
): Cache<PairsGetRequest, PairDbResponse> => {
  const cache = new LRU<string, PairDbResponse>({
    max: size,
    maxAge: maxAgeMillis,
  });

  const toStringKey = (req: PairsGetRequest): string =>
    req.matcher + req.pair.amountAsset + req.pair.priceAsset;

  return {
    get: key => {
      try {
        const k = toStringKey(key);
        const p = cache.get(k);
        if (typeof p !== 'undefined') return task(just(p));
        else return task(nothing());
      } catch (err) {
        return rejected(err);
      }
    },
    set: (key, value) => {
      try {
        const k = toStringKey(key);
        cache.set(k, value);
        return task(undefined);
      } catch (err) {
        return rejected(err);
      }
    },
  };
};
