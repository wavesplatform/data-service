import { Task, waitAll, of } from "folktale/concurrency/task";
import * as maybe from 'folktale/maybe';
import * as LRU from 'lru-cache';
import { map } from 'ramda';

import { ServiceMget, Rate, rate, AssetIdsPair, RateMGetParams, RateInfo, list } from "../../types";
import { tap } from "../../utils/tap";
import { AppError } from "../../errorHandling";
import { RateSerivceCreatorDependencies } from '../../services';
import RateEstimator from './RateEstimator';

export interface PairCheckService {
  checkPair(matcher: string, pair: [string, string]): Task<AppError, maybe.Maybe<[string, string]>>
}

export const dummyPairCheck: PairCheckService = {
  checkPair() { return of(maybe.empty()) }
}

const toCacheKey = (params: AssetIdsPair, matcher: string): string =>
  [matcher, params.amountAsset, params.priceAsset].join("::");

const CACHE_AGE_MILLIS = 5000;
const CACHE_SIZE = 100000;

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

  const get = (pair: AssetIdsPair, matcher: string, date: Date): Task<AppError, RateInfo> => {
    const key = toCacheKey(pair, matcher);

    if (cache.has(key)) {
      return of(cache.get(key)!)
    }

    return estimator.estimate(pair, matcher, date)
      .map(res => ({ current: res, ...pair }))
      .map(
        tap(
          res => cache.set(key, res)
        )
      );
  }
  
  return {
    mget(request: RateMGetParams) {
      return waitAll(
        map(          
          item => get(item, request.matcher, request.date).map(rate),
          request.pairs          
        )
      ).map(list)
    }
  }
}
