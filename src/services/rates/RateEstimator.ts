import { Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';

import { tap } from '../../utils/tap';
import { AssetIdsPair, RateInfo, RateMgetParams } from '../../types';
import { AppError, DbError } from '../../errorHandling';

import { partitionByPreCount, AsyncMget, RateCache } from './repo';
import { RateCacheKey } from './repo/impl/RateCache';
import RateInfoLookup from './repo/impl/RateInfoLookup';
import { isEmpty } from '../../utils/fp/maybeOps';

type ReqAndRes<TReq, TRes> = {
  req: TReq;
  res: Maybe<TRes>;
};

export default class RateEstimator
  implements
    AsyncMget<RateMgetParams, ReqAndRes<AssetIdsPair, RateInfo>, AppError> {
  constructor(
    private readonly cache: RateCache,
    private readonly remoteGet: AsyncMget<RateMgetParams, RateInfo, DbError>
  ) {}

  mget(
    request: RateMgetParams
  ): Task<AppError, ReqAndRes<AssetIdsPair, RateInfo>[]> {
    const { pairs, timestamp, matcher } = request;

    const shouldCache = isEmpty(timestamp);

    const getCacheKey = (pair: AssetIdsPair): RateCacheKey => ({
      pair,
      matcher,
    });

    const cacheAll = (items: RateInfo[]) =>
      items.forEach(it => this.cache.set(getCacheKey(it), it.current));

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
                  this.cache.set(getCacheKey(reqAndRes.req), res.current);
                }
              })
            )
          )
        )
      );
  }
}
