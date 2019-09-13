import { BigNumber } from '@waves/data-entities';
import { ServiceMget, Rate, RateMgetParams, list, rate } from '../../types';
import { RateSerivceCreatorDependencies } from '../../services';
import RateEstimator from './RateEstimator';
import RemoteRateRepo from './repo/impl/RemoteRateRepo';

export { default as RateCacheImpl } from './repo/impl/RateCache';

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
              current: item.res
                .map(it => it.current)
                .getOrElse(new BigNumber(0)),
              ...item.req,
            })
          )
        )
        .map(list);
    },
  };
}
