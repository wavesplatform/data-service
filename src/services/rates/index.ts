import { Task, /*waitAll,*/ of } from "folktale/concurrency/task";
import { Maybe, empty as maybeEmpty } from 'folktale/maybe';
import * as LRU from 'lru-cache';
// import { map } from 'ramda';
import { BigNumber } from "@waves/data-entities";
import { ServiceMget, Rate, RateMgetParams, list, rate } from "../../types";
import { AppError } from "../../errorHandling";
import { RateSerivceCreatorDependencies } from '../../services';
import RateEstimator from './RateEstimator';

export interface PairOrderingService {
  getCorrectOrder(matcher: string, pair: [string, string]): Task<AppError, Maybe<[string, string]>>
}

export const dummyPairOrdering: PairOrderingService = {
  getCorrectOrder() { return of(maybeEmpty()) }
}

const CACHE_AGE_MILLIS = 5 * 60 * 1000; // 5 minutes
const CACHE_SIZE = 100000;

function maybeIsPresent<T>(val: Maybe<T>): boolean {
  return val.matchWith(
    {
      Nothing: () => false,
      Just: () => true
    }
  )
}

export default function({
  txService,
  pairOrderingService,
  drivers
}: RateSerivceCreatorDependencies): ServiceMget<RateMgetParams, Rate> {

  const cache = new LRU<string, BigNumber>(
    {
      max: CACHE_SIZE,
      maxAge: CACHE_AGE_MILLIS,
    }
  );

  // const estimator = new RateEstimator(txService, pairOrderingService, cache, drivers.pg)
  const estimator = new RateEstimator(cache, drivers.pg)
  
  return {
    mget(request: RateMgetParams) {
      return estimator.estimate(request.pairs, request.matcher, request.timestamp)
        .map(data => data.filter(it => maybeIsPresent(it.res)).map(it => rate(it.res.getOrElse(null))))
        .map(list)

      // return of(list([]))

      // return waitAll(
      //   map(          
      //     pair => estimator.estimate(pair, request.matcher, request.timestamp)
      //       .map(
      //         (rateValue: BigNumber) => rate({ current: rateValue, ...pair })
      //       ),
      //     request.pairs          
      //   )
      // ).map(list)
    }
  }
}
