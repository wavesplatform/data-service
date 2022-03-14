import { rejected, Task } from 'folktale/concurrency/task';
import { Maybe, of as maybeOf } from 'folktale/maybe';
import { splitEvery, sequence } from 'ramda';
import { Asset, BigNumber } from '@waves/data-entities';

import { AppError, DbError, Timeout } from '../../errorHandling';
import { collect } from '../../utils/collection';
import { tap } from '../../utils/tap';
import { isEmpty } from '../../utils/fp/maybeOps';
import { RateInfo, RateMgetParams, RateWithPairIds } from '../../types';
import { PairsService } from '../pairs';
import { AssetsService } from '../assets';
import { MoneyFormat } from '../types';

import { partitionByPreComputed, AsyncMget, RateCache } from './repo';
import { RateCacheKey } from './repo/impl/RateCache';
import RateInfoLookup from './repo/impl/RateInfoLookup';
import { IThresholdAssetRateService } from './ThresholdAssetRateService';

type ReqAndRes<TReq, TRes> = {
  req: TReq;
  res: Maybe<TRes>;
};

export type AssetPair = {
  amountAsset: Asset;
  priceAsset: Asset;
};

export type RateWithPair = RateInfo & AssetPair;
export type VolumeAwareRateInfo = RateWithPair & { volumeWaves: BigNumber };

export default class RateEstimator
  implements AsyncMget<RateMgetParams, ReqAndRes<AssetPair, RateWithPairIds>, AppError>
{
  constructor(
    private readonly baseAssetId: string,
    private readonly cache: RateCache,
    private readonly remoteGet: AsyncMget<
      RateMgetParams,
      RateWithPairIds,
      DbError | Timeout
    >,
    private readonly pairs: PairsService,
    private readonly pairAcceptanceVolumeThreshold: number,
    private readonly thresholdAssetRateService: IThresholdAssetRateService,
    private readonly assetsService: AssetsService
  ) {}

  mget(
    request: RateMgetParams
  ): Task<AppError | DbError | Timeout, ReqAndRes<AssetPair, RateWithPairIds>[]> {
    const { pairs, timestamp, matcher } = request;

    const shouldCache = isEmpty(timestamp);

    const getCacheKey = (pair: AssetPair): RateCacheKey => ({
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

    let ids = pairs.reduce((acc, cur) => {
      acc.push(cur.amountAsset, cur.priceAsset);
      return acc;
    }, new Array<string>());

    ids.push(this.baseAssetId);

    return this.assetsService.mget({ ids }).chain((ms) =>
      sequence<Maybe<Asset>, Maybe<Asset[]>>(maybeOf, ms).matchWith({
        Nothing: () =>
          rejected(
            AppError.Validation(
              'Some of the assets of specified pairs do not exist in the blockchain',
              {
                ids: collect<Maybe<Asset>, number>((m, idx) =>
                  isEmpty(m) ? idx : undefined
                )(ms).map((idx) => ids[idx]),
              }
            )
          ) as any,
        Just: ({ value: assets }) => {
          let baseAsset = assets.pop() as Asset;

          let pairsWithAssets = splitEvery(2, assets).map(
            ([amountAsset, priceAsset]) => ({
              amountAsset,
              priceAsset,
            })
          );

          let assetsMap: Record<string, Asset> = {};
          assetsMap[this.baseAssetId] = baseAsset;
          assets.forEach((asset) => {
            assetsMap[asset.id] = asset;
          });

          const { preComputed, toBeRequested } = partitionByPreComputed(
            this.cache,
            pairsWithAssets,
            getCacheKey,
            shouldCache,
            baseAsset
          );

          return this.remoteGet
            .mget({
              pairs: toBeRequested.map((pair) => ({
                amountAsset: pair.amountAsset.id,
                priceAsset: pair.priceAsset.id,
              })),
              matcher,
              timestamp,
            })
            .chain((pairsWithRates) =>
              this.pairs
                .mget({
                  pairs: pairsWithRates,
                  matcher: request.matcher,
                  // NB: affect volumeWaves, that is compared with threshold in RateInfoLookup
                  // should be float mutually with mPairAcceptanceVolumeThreshold, passed to RateInfoLookup
                  moneyFormat: MoneyFormat.Float,
                })
                .map((foundPairs) =>
                  foundPairs.map((itm, idx) =>
                    itm
                      .map((pair) => ({
                        amountAsset: assetsMap[pair.amountAsset],
                        priceAsset: assetsMap[pair.priceAsset],
                        volumeWaves: pair.volumeWaves as BigNumber,
                        rate: pairsWithRates[idx].rate,
                      }))
                      .getOrElse<VolumeAwareRateInfo>({
                        amountAsset: assetsMap[pairsWithRates[idx].amountAsset],
                        priceAsset: assetsMap[pairsWithRates[idx].priceAsset],
                        rate: pairsWithRates[idx].rate,
                        volumeWaves: new BigNumber(0),
                      })
                  )
                )
            )
            .map(
              tap((results: Array<VolumeAwareRateInfo>) => {
                if (shouldCache) cacheAll(results);
              })
            )
            .chain((data: Array<VolumeAwareRateInfo>) =>
              this.thresholdAssetRateService.get().map(
                (mThresholdAssetRate) =>
                  new RateInfoLookup(
                    data.concat(preComputed),
                    mThresholdAssetRate.map((thresholdAssetRate) =>
                      new BigNumber(this.pairAcceptanceVolumeThreshold).dividedBy(
                        thresholdAssetRate
                      )
                    ),
                    baseAsset
                  )
              )
            )
            .map((lookup) =>
              pairsWithAssets.map((pair) => ({
                req: pair,
                res: lookup.get({
                  ...pair,
                  moneyFormat: MoneyFormat.Long,
                }),
              }))
            )
            .map(
              tap((data) => {
                data.forEach((reqAndRes) =>
                  reqAndRes.res.map(
                    tap((res) => {
                      if (shouldCache) {
                        cacheUnlessCached(res);
                      }
                    })
                  )
                );
              })
            )
            .map((rs) =>
              rs.map((reqAndRes) => ({
                ...reqAndRes,
                res: reqAndRes.res.map((res) => ({
                  ...res,
                  amountAsset: res.amountAsset.id,
                  priceAsset: res.priceAsset.id,
                })),
              }))
            );
        },
      })
    );
  }
}
