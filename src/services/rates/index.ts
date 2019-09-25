import { BigNumber } from '@waves/data-entities';
import { ServiceMget, Rate, RateMgetParams, list, rate, RateInfo, AssetIdsPair } from '../../types';
import { RateSerivceCreatorDependencies } from '../../services';
import RateEstimator from './RateEstimator';
import RemoteRateRepo from './repo/impl/RemoteRateRepo';

export { default as RateCacheImpl } from './repo/impl/RateCache';

export type RateWithPairIds = RateInfo & AssetIdsPair;

export default function({
  drivers,
  cache,
}: RateSerivceCreatorDependencies): ServiceMget<RateMgetParams, Rate> {
  const estimator = new RateEstimator(cache, new RemoteRateRepo(drivers.pg));

  return {
    mget(request: RateMgetParams) {
      return estimator
        .mget(request)
        .map(data =>
          data.map(item =>
            rate({
              rate: item.res.fold(() => new BigNumber(0), it => it.rate)
            }, { amountAsset: item.req.amountAsset, priceAsset: item.req.priceAsset })
          )
        )
        .map(list);
    },
  };
}
