import { BigNumber } from '@waves/data-entities';
import { Maybe } from 'folktale/maybe';

import { ServiceMget, Rate, RateMgetParams, list, rate, AssetIdsPair } from '../../types';
import { RateSerivceCreatorDependencies } from '../../services';
import RateEstimator from './RateEstimator';
import RemoteRateRepo from './repo/impl/RemoteRateRepo';
export { default as RateCacheImpl } from './repo/impl/RateCache';

export type RateWithPairIds = { rate: Maybe<BigNumber> } & AssetIdsPair;

export default function ({
  drivers,
  cache,
  pairs,
  pairAcceptanceVolumeThreshold,
  thresholdAssetRateService
}: RateSerivceCreatorDependencies): ServiceMget<RateMgetParams, Rate> {
  const estimator = new RateEstimator(
    cache,
    new RemoteRateRepo(drivers.pg),
    pairs,
    pairAcceptanceVolumeThreshold,
    thresholdAssetRateService
  );

  return {
    mget(request: RateMgetParams) {
      return estimator
        .mget(request)
        .map((data) =>
          data.map((item) =>
            rate(
              {
                rate: item.res.fold(
                  () => new BigNumber(0),
                  (it) =>
                    it.rate.matchWith({
                      Just: ({ value }) => value,
                      Nothing: () => new BigNumber(0),
                    })
                ),
              },
              {
                amountAsset: item.req.amountAsset,
                priceAsset: item.req.priceAsset,
              }
            )
          )
        )
        .map(list);
    },
  };
}
