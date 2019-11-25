import { BigNumber } from '@waves/data-entities';
import { Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';

import { tap } from '../../utils/tap';
import { AssetIdsPair, RateMgetParams } from '../../types';
import { AppError, DbError, Timeout } from '../../errorHandling';

import { partitionByPreCount, AsyncMget, RateCache } from './repo';
import { RateCacheKey } from './repo/impl/RateCache';
import RateInfoLookup from './repo/impl/RateInfoLookup';
import { isEmpty } from '../../utils/fp/maybeOps';
import { RateWithPairIds } from '../rates';

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
    >
  ) {}

  mget(
    request: RateMgetParams
  ): Task<AppError, ReqAndRes<AssetIdsPair, RateWithPairIds>[]> {
    const { pairs, timestamp, matcher } = request;

    const shouldCache = isEmpty(timestamp);

    const getCacheKey = (pair: AssetIdsPair): RateCacheKey => ({
      pair,
      matcher,
    });

    const cacheUnlessCached = (item: AssetIdsPair, rate: BigNumber) => {
      const key = getCacheKey(item);

      if (!this.cache.has(key)) {
        this.cache.set(key, rate);
      }
    };

    const cacheAll = (items: Array<RateWithPairIds>) =>
      items.forEach(it => cacheUnlessCached(it, it.rate));

    const { preCount, toBeRequested } = partitionByPreCount(
      this.cache,
      pairs,
      getCacheKey,
      shouldCache
    );

    return this.remoteGet
      .mget({ pairs: toBeRequested, matcher, timestamp })
      .map(results => {
        if (shouldCache) cacheAll(results);
        return results;
      })
      .map(data => new RateInfoLookup(data.concat(preCount)))
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
                  cacheUnlessCached(reqAndRes.req, res.rate);
                }
              })
            )
          )
        )
      );
  }
}
