import { BigNumber } from '@waves/data-entities';
import { Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';
import { isNil } from 'ramda';

import { AppError, DbError, Timeout } from '../../errorHandling';
import { AssetIdsPair, Pair, RateMgetParams } from '../../types';
import { tap } from '../../utils/tap';
import { isEmpty } from '../../utils/fp/maybeOps';

import { PairsService } from '../pairs';
import { RateWithPairIds } from '../rates';
import { partitionByPreComputed, AsyncMget, RateCache } from './repo';
import { RateCacheKey } from './repo/impl/RateCache';
import RateInfoLookup from './repo/impl/RateInfoLookup';

type ReqAndRes<TReq, TRes> = {
  req: TReq;
  res: Maybe<TRes>;
};

export type VolumeAwareRateInfo = RateWithPairIds & { volumeWaves: BigNumber };

export default class RateEstimator
  implements
    AsyncMget<RateMgetParams, ReqAndRes<AssetIdsPair, RateWithPairIds>, AppError> {
  constructor(
    private readonly cache: RateCache,
    private readonly remoteGet: AsyncMget<
      RateMgetParams,
      RateWithPairIds,
      DbError | Timeout
    >,
    private readonly pairs: PairsService,
    private readonly pairAcceptanceVolumeThreshold: number
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
      items.forEach((it) => cacheUnlessCached(it));

    const { preComputed, toBeRequested } = partitionByPreComputed(
      this.cache,
      pairs,
      getCacheKey,
      shouldCache
    );

    return this.remoteGet
      .mget({ pairs: toBeRequested, matcher, timestamp })
      .chain((pairsWithRates) =>
        this.pairs
          .mget({
            pairs: pairsWithRates.map((pairWithRate) => ({
              amountAsset: pairWithRate.amountAsset,
              priceAsset: pairWithRate.priceAsset,
            })),
            matcher: request.matcher,
          })
          .map((foundPairs) =>
            foundPairs.data.map((pair: Pair, idx: number) => {
              if (isNil(pair.data)) {
                return {
                  ...pairsWithRates[idx],
                  volumeWaves: new BigNumber(0),
                };
              } else {
                return {
                  amountAsset: pair.amountAsset as string,
                  priceAsset: pair.priceAsset as string,
                  volumeWaves: pair.data.volumeWaves,
                  rate: pairsWithRates[idx].rate,
                };
              }
            })
          )
          .map(
            tap((results) => {
              if (shouldCache) cacheAll(results);
            })
          )
          .map(
            (data) =>
              new RateInfoLookup(
                data.concat(preComputed),
                this.pairAcceptanceVolumeThreshold
              )
          )
          .map((lookup) =>
            pairs.map((idsPair) => ({
              req: idsPair,
              res: lookup.get(idsPair),
            }))
          )
          .map(
            tap((data) =>
              data.forEach((reqAndRes) =>
                reqAndRes.res.map(
                  tap((res) => {
                    if (shouldCache) {
                      cacheUnlessCached(res);
                    }
                  })
                )
              )
            )
          )
      );
  }
}
