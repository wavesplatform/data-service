import { Task, of } from "folktale/concurrency/task";
import { Maybe, empty as maybeEmpty } from 'folktale/maybe';
import * as LRU from 'lru-cache';
import { BigNumber } from "@waves/data-entities";
import { ServiceMget, Rate, RateMgetParams, list, rate } from "../../types";
import { AppError } from "../../errorHandling";
import { RateSerivceCreatorDependencies } from '../../services';
import RateEstimator from './RateEstimator';
import RemoteRateRepo from './repo/impl/RemoteRateRepo';
import RateCache from './repo/impl/RateCache'

export interface PairOrderingService {
  getCorrectOrder(matcher: string, pair: [string, string]): Task<AppError, Maybe<[string, string]>>
}

export const dummyPairOrdering: PairOrderingService = {
  getCorrectOrder() { return of(maybeEmpty()) }
}

const CACHE_AGE_MILLIS = 5 * 60 * 1000; // 5 minutes
const CACHE_SIZE = 200000;

export default function({
  drivers
}: RateSerivceCreatorDependencies): ServiceMget<RateMgetParams, Rate> {

  const estimator = new RateEstimator(
    new RateCache(
      new LRU<string, BigNumber>(
        {
          max: CACHE_SIZE,
          maxAge: CACHE_AGE_MILLIS,
        }
      )      
    ),
    new RemoteRateRepo(drivers.pg)
  )
  
  return {
    mget(request: RateMgetParams) {
      return estimator.get(request)
        .map(data => data.map(
          item => rate(
            {
              current: item.res.map(it => it.current).getOrElse(new BigNumber(0)),
                ...item.req,
            }
          )
        ))
        .map(list)
    }
  }
}
