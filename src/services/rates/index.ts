import { Task, waitAll, of } from "folktale/concurrency/task";
import { Maybe, empty as maybeEmpty, of as maybeOf } from 'folktale/maybe';
import * as LRU from 'lru-cache';
import { map } from 'ramda';

import { ServiceMget, Rate, rate, RateMGetParams, RateGetParams, RateInfo, list } from "../../types";
import { tap } from "../../utils/tap";
import { AppError } from "../../errorHandling";
import { RateSerivceCreatorDependencies } from '../../services';
import RateEstimator from './RateEstimator';

export interface PairCheckService {
  checkPair(matcher: string, pair: [string, string]): Task<AppError, Maybe<[string, string]>>
}

export const dummyPairCheck: PairCheckService = {
  checkPair() { return of(maybeEmpty()) }
}

const CACHE_AGE_MILLIS = 5000;
const CACHE_SIZE = 100000;

function maybeInverted<T, R>(data: Maybe<T>, val: R): Maybe<R> {
  return data.matchWith(
    {
      Just: () => maybeEmpty(),
      Nothing: () => maybeOf(val)
    }
  )
}

function cached<K, In, Out>(
  get: (data: In) => Task<AppError, Out>,
  cache: LRU<K, Out>,
  keyFn: (data: In) => Maybe<K>,
): (data: In) => Task<AppError, Out> {
  return (data: In) => keyFn(data).matchWith(
    {
      Just: ({ value }) => {
        if (cache.has(value)) {
          return of(cache.get(value)!)
        }

        return get(data)
          .map(
            tap(
              res => cache.set(value, res)
            )
          );
      },
      Nothing: () => get(data)
    }
  )  
}

export default function({
  txService,
  pairCheckService
}: RateSerivceCreatorDependencies): ServiceMget<RateMGetParams, Rate> {

  const cache = new LRU<string, RateInfo>(
    {
      max: CACHE_SIZE,
      maxAge: CACHE_AGE_MILLIS,
    }
  );

  const estimator = new RateEstimator(txService, pairCheckService)

  const get = cached<string, RateGetParams, RateInfo>(
    ({ pair, matcher, timestamp }: RateGetParams): Task<AppError, RateInfo> =>
      estimator.estimate(
        pair, matcher, timestamp.getOrElse(new Date())
      ).map(
        res => ({ current: res, ...pair })
      ),

    cache,

    (params: RateGetParams) => maybeInverted<Date, string>(
      params.timestamp,
      [params.matcher, params.pair.amountAsset, params.pair.priceAsset].join("::")
    ),
  )
  
  return {
    mget(request: RateMGetParams) {
      return waitAll(
        map(          
          pair => get({ pair, matcher: request.matcher, timestamp: request.timestamp }).map(rate),
          request.pairs          
        )
      ).map(list)
    }
  }
}
