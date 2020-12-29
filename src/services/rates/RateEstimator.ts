import { Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';

import { tap } from '../../utils/tap';
import { AssetIdsPair, RateMgetParams, RateWithPairIds, VolumeAwareRateInfo } from '../../types';
import { AppError, DbError, Timeout } from '../../errorHandling';

import { partitionByPreComputed, AsyncMget, RateCache } from './repo';
import { RateCacheKey } from './repo/impl/RateCache';
import RateInfoLookup from './repo/impl/RateInfoLookup';
import { isEmpty } from '../../utils/fp/maybeOps';

import { PairsService } from 'services/pairs';
import { MoneyFormat } from '../../services/types';
import { BigNumber } from '@waves/data-entities';

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
    private readonly pairs: PairsService,
    private readonly pairAcceptanceVolumeThreshold: number,
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

    const cacheUnlessCached = (item: VolumeAwareRateInfo) => {
      const key = getCacheKey(item);

      if (!this.cache.has(key)) {
        this.cache.set(key, item);
      }
    };

    const cacheAll = (items: Array<VolumeAwareRateInfo>) =>
      items.forEach(it => cacheUnlessCached(it));

    const { preComputed, toBeRequested } = partitionByPreComputed(
      this.cache,
      pairs,
      getCacheKey,
      shouldCache
    );

    return this.remoteGet
      .mget({ pairs: toBeRequested, matcher, timestamp })
      .chain(pairsWithRates => {
        return this.pairs.mget({
          pairs: pairsWithRates,
          matcher: request.matcher,
          moneyFormat: MoneyFormat.Long,
        }).map(foundPairs => {
          return foundPairs.map(
            (itm, idx) => itm
              .map(pair => Object.assign(pair, { rate: pairsWithRates[idx].rate }))
              .getOrElse<VolumeAwareRateInfo>({...pairsWithRates[idx], volumeWaves: new BigNumber(0)})
          )
        })
      })
      .map(results => {
        if (shouldCache) cacheAll(results);
        return results;
      })
      .map(data => new RateInfoLookup([...data, ...preComputed], this.pairAcceptanceVolumeThreshold))
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
