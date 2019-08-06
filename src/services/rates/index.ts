import { Task, waitAll, of } from "folktale/concurrency/task";
import { Maybe, empty as maybeEmpty } from 'folktale/maybe';
import * as LRU from 'lru-cache';
import { map, always } from 'ramda';

import { ServiceMget, Rate, rate, RateMgetParams, RateGetParams, RateInfo, list } from "../../types";
import { tap } from "../../utils/tap";
import { AppError } from "../../errorHandling";
import { RateSerivceCreatorDependencies } from '../../services';
import RateEstimator from './RateEstimator';

export interface PairOrderingService {
  getCorrectOrder(matcher: string, pair: [string, string]): Task<AppError, Maybe<[string, string]>>
}

export const dummyPairOrdering: PairOrderingService = {
  getCorrectOrder() { return of(maybeEmpty()) }
}

const CACHE_AGE_MILLIS = 5000;
const CACHE_SIZE = 100000;

function maybeIsNone<T>(data: Maybe<T>): boolean {
  return data.matchWith(
    {
      Just: always(false),
      Nothing: always(true)
    }
  )
}

type CacheParams<K, In, Out> = {
  cache: LRU<K, Out>,
  keyFn: (data: In) => K,
  shouldCache: (data: In) => boolean  
}
function cached<K, In, Out>(
  get: (data: In) => Task<AppError, Out>,
  { cache, keyFn, shouldCache }: CacheParams<K, In, Out>
): (data: In) => Task<AppError, Out> {
  return (data: In) => {
    if (shouldCache(data)) {
      const key = keyFn(data);

      if (cache.has(key)) {
        return of(cache.get(key)!)
      }

      return get(data)
        .map(
          tap(
            res => cache.set(key, res)
          )
        );      
    } else {
      return get(data)
    }
  }
}

export default function({
  txService,
  pairOrderingService
}: RateSerivceCreatorDependencies): ServiceMget<RateMgetParams, Rate> {

  const cache = new LRU<string, RateInfo>(
    {
      max: CACHE_SIZE,
      maxAge: CACHE_AGE_MILLIS,
    }
  );

  const estimator = new RateEstimator(txService, pairOrderingService)

  const get = cached<string, RateGetParams, RateInfo>(
    ({ pair, matcher, timestamp }: RateGetParams): Task<AppError, RateInfo> =>
      estimator.estimate(
        pair, matcher, timestamp.getOrElse(new Date())
      ).map(
        res => ({ current: res, ...pair })
      ),

    {
      cache,
      keyFn: params => [params.matcher, params.pair.amountAsset, params.pair.priceAsset].join("::"),
      shouldCache: params => maybeIsNone(params.timestamp)
    }
  )
  
  return {
    mget(request: RateMgetParams) {
      return waitAll(
        map(          
          pair => get({ pair, matcher: request.matcher, timestamp: request.timestamp }).map(rate),
          request.pairs          
        )
      ).map(list)
    }
  }
}
