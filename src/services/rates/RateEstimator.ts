import { Task } from "folktale/concurrency/task";
import { Maybe, of as maybeOf } from 'folktale/maybe';

import { identity } from 'ramda';

import { tap } from "../../utils/tap";
import { AssetIdsPair, RateInfo } from "../../types";
import { AppError, DbError } from "../../errorHandling";

import { partitionByPreCount, AsyncGet } from './repo';
import  RateCache, { RateCacheKey } from './repo/impl/RateCache';
import RateInfoLookup from './repo/impl/RateInfoLookup'
import { maybeIsNone } from "./util";
import { RemoteRequestParams } from "./repo/impl/RemoteRateRepo";

type ReqAndRes<TReq, TRes> = {
  req: TReq,
  res: Maybe<TRes>
}

export default class RateEstimator {
  constructor(
    private readonly cache: RateCache,
    private readonly remoteGet: AsyncGet<RemoteRequestParams, RateInfo[], DbError>
  ) { }

  estimate(pairs: AssetIdsPair[], matcher: string, timestamp: Maybe<Date>): Task<AppError, ReqAndRes<AssetIdsPair, RateInfo>[]> {
    const shouldCache = maybeIsNone(timestamp)

    const getCacheKey = (pair: AssetIdsPair): Maybe<RateCacheKey> =>
      maybeOf(shouldCache).filter(identity).map(
        () => (
          {
            pair, matcher
          })
      );
    
    const cacheAll = (items: RateInfo[]) => items.forEach(
      it => this.cache.put(getCacheKey(it), it.current)
    )
    
    const { preCount, toBeRequested } = partitionByPreCount(this.cache, pairs, getCacheKey)

    return this.remoteGet.get({ pairs: toBeRequested, matcher, timestamp }).map(
      tap(cacheAll)
    ).map(
      data => new RateInfoLookup(data.concat(preCount))
    ).map(
      lookup => pairs.map(
        idsPair => (
          {
            req: idsPair,
            res: lookup.get(idsPair)
          }
        )
      )
    ).map(
      tap(
        data => data.forEach(
          reqAndRes => reqAndRes.res.map(
            tap(res => this.cache.put(getCacheKey(reqAndRes.req), res.current))
          )
        )
      )
    )
  }
}
