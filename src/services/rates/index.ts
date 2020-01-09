import { BigNumber } from '@waves/data-entities';
import { withStatementTimeout } from '../../db/driver';
import { Service, RateMgetParams, RateWithPairIds } from '../../types';
import { RateSerivceCreatorDependencies } from '..';
import RateEstimator from './RateEstimator';
import RemoteRateRepo from './repo/impl/RemoteRateRepo';
import { WithDecimalsFormat } from '../types';

export { default as RateCacheImpl } from './repo/impl/RateCache';

export type RatesMgetService = Service<
  RateMgetParams & WithDecimalsFormat,
  RateWithPairIds[]
>;

export default function({
  drivers,
  cache,
  timeouts,
}: RateSerivceCreatorDependencies): RatesMgetService {
  const estimator = new RateEstimator(
    cache,
    new RemoteRateRepo(withStatementTimeout(drivers.pg, timeouts.mget))
  );

  return (request: RateMgetParams) =>
    estimator.mget(request).map(data =>
      data.map(item => ({
        rate: item.res.fold(
          () => new BigNumber(0),
          it => it.rate
        ),
        amountAsset: item.req.amountAsset,
        priceAsset: item.req.priceAsset,
      }))
    );
}
