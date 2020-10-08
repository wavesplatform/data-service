import { BigNumber } from '@waves/data-entities';
import { Service, RateMgetParams, RateWithPairIds } from '../../types';
import { RateSerivceCreatorDependencies } from '..';
import RateEstimator from './RateEstimator';
import RemoteRateRepo from './repo/impl/RemoteRateRepo';
import { DecimalsFormat, WithDecimalsFormat } from '../types';
import { of as taskOf } from 'folktale/concurrency/task';

export { default as RateCacheImpl } from './repo/impl/RateCache';

export type RatesMgetService = Service<
  RateMgetParams & WithDecimalsFormat,
  RateWithPairIds[]
>;

export default function ({
  drivers,
  cache,
  assets,
}: RateSerivceCreatorDependencies): RatesMgetService {
  const estimator = new RateEstimator(cache, new RemoteRateRepo(drivers.pg));

  return (request: RateMgetParams & WithDecimalsFormat) =>
    estimator
      .mget(request)
      .map((data) =>
        data.map((item) => ({
          rate: item.res.fold(
            () => new BigNumber(0),
            (it) => it.rate
          ),
          amountAsset: item.req.amountAsset,
          priceAsset: item.req.priceAsset,
        }))
      )
      .chain((items) =>
        request.decimalsFormat === DecimalsFormat.Long
          ? taskOf(items)
          : assets
              .precisions({
                ids: items.reduce<string[]>(
                  (acc, item) =>
                    acc.concat([item.amountAsset, item.priceAsset]),
                  []
                ),
              })
              .map((precisions) =>
                items.map((item) => ({
                  ...item,
                  rate: item.rate.multipliedBy(
                    10 ** (-8 - precisions[1] + precisions[0])
                  ),
                }))
              )
      );
}
