import { Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';

import { tap } from '../../utils/tap';
import { AssetIdsPair, RateMgetParams, RateWithPairIds, EstimationReadyRateInfo } from '../../types';
import { AppError, DbError, Timeout } from '../../errorHandling';

import { partitionByPreCount, AsyncMget, RateCache } from './repo';
import { RateCacheKey } from './repo/impl/RateCache';
import RateInfoLookup from './repo/impl/RateInfoLookup';
import { isEmpty } from '../../utils/fp/maybeOps';

import { PairsService } from 'services/pairs';
import { PairOrderingService } from 'services/PairOrderingService';
import { MoneyFormat } from '../../services/types';
import { complement } from 'ramda';

type ReqAndRes<TReq, TRes> = {
  req: TReq;
  res: Maybe<TRes>;
};

export default class RateEstimator
  implements
    AsyncMget<
      RateMgetParams,
      ReqAndRes<AssetIdsPair, RateWithPairIds>,
      AppError
    > {
  constructor(
    private readonly cache: RateCache,
    private readonly remoteGet: AsyncMget<
      RateMgetParams,
      RateWithPairIds,
      DbError | Timeout
      >,
    // @ts-ignore-next-line
    private readonly pairs: PairsService,
    // @ts-ignore-next-line
    private readonly pairsOrder: PairOrderingService,
  ) {}

  mget(
    request: RateMgetParams
  ): Task<AppError, ReqAndRes<AssetIdsPair, RateWithPairIds>[]> {
    const { pairs, timestamp, matcher } = request;

    console.log("PAIRS_REQ: ", pairs);

    const shouldCache = isEmpty(timestamp);

    const getCacheKey = (pair: AssetIdsPair): RateCacheKey => ({
      pair,
      matcher,
    });

    const cacheUnlessCached = (item: EstimationReadyRateInfo) => {
      const key = getCacheKey(item);

      if (!this.cache.has(key)) {
        this.cache.set(key, item);
      }
    };

    const cacheAll = (items: Array<EstimationReadyRateInfo>) =>
      items.forEach(it => cacheUnlessCached(it));

    const { preCount, toBeRequested } = partitionByPreCount(
      this.cache,
      pairs,
      getCacheKey,
      shouldCache
    );

    console.log("PRE_COUNT: ", preCount);
    console.log("TO_BE_REQUESTED: ", toBeRequested);
    
    return this.remoteGet
      .mget({ pairs: toBeRequested, matcher, timestamp })
      .chain(pairsWithRates => {
        return this.pairs.mget({
          pairs: pairsWithRates,
          matcher: request.matcher,
          moneyFormat: MoneyFormat.Long,
        }).map(foundPairs => {
          return foundPairs.map(
            (itm, idx) => itm.map(pair => Object.assign(pair, { rate: pairsWithRates[idx].rate }))
          )
        })
      })
      .map(results => {
        const unwrappedRes = results.filter(complement(isEmpty)).map(it => it.unsafeGet())
        
        if (shouldCache) cacheAll(unwrappedRes);
        return unwrappedRes;
      })
      .map(data => new RateInfoLookup([...data, ...preCount]))
      .map(lookup =>
        pairs.map(idsPair => ({
          req: idsPair,
          res: lookup.get(idsPair),
        }))
      )
      .map(
        tap(data =>
          data.forEach(reqAndRes =>
            reqAndRes.res.map(
              tap(res => {
                if (shouldCache) {
                  cacheUnlessCached(res);
                }
              })
            )
          )
        )
      );
  }
}
