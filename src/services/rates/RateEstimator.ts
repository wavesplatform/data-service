import { Task } from 'folktale/concurrency/task';
import { Maybe, of as maybeOf } from 'folktale/maybe';
import { BigNumber } from '@waves/data-entities';
import { identity } from 'ramda';

import { tap } from '../../utils/tap';
import { AssetIdsPair, RateInfo, RateMgetParams } from '../../types';
import { AppError, DbError } from '../../errorHandling';

import { partitionByPreCount, Cache, AsyncMget } from './repo';
import { RateCacheKey } from './repo/impl/RateCache';
import RateInfoLookup from './repo/impl/RateInfoLookup';
import { maybeIsNone } from './util';

type ReqAndRes<TReq, TRes> = {
  req: TReq;
  res: Maybe<TRes>;
};

export default class RateEstimator
  implements
    AsyncMget<RateMgetParams, ReqAndRes<AssetIdsPair, RateInfo>, AppError> {
  constructor(
    private readonly cache: Cache<Maybe<RateCacheKey>, BigNumber>,
    private readonly remoteGet: AsyncMget<RateMgetParams, RateInfo, DbError>
  ) {}

  mget(
    request: RateMgetParams
  ): Task<AppError, ReqAndRes<AssetIdsPair, RateInfo>[]> {
    const { pairs, timestamp, matcher } = request;

    const shouldCache = maybeIsNone(timestamp);

    const getCacheKey = (pair: AssetIdsPair): Maybe<RateCacheKey> =>
      maybeOf(shouldCache)
        .filter(identity)
        .map(() => ({
          pair,
          matcher,
        }));

    const cacheAll = (items: RateInfo[]) =>
      items.forEach(it => this.cache.put(getCacheKey(it), it.current));

    const { preCount, toBeRequested } = partitionByPreCount(
      this.cache,
      pairs,
      getCacheKey
    );

    return this.remoteGet
      .mget({ pairs: toBeRequested, matcher, timestamp })
      .map(tap(cacheAll))
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
              tap(res =>
                this.cache.put(getCacheKey(reqAndRes.req), res.current)
              )
            )
          )
        )
      );
  }
}
