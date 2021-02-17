import { BigNumber } from '@waves/data-entities';
import { Service, RateMgetParams, RateWithPairIds } from '../../types';
import { RateSerivceCreatorDependencies } from '..';
import RateEstimator from './RateEstimator';
import RemoteRateRepo from './repo/impl/RemoteRateRepo';
import { MoneyFormat, WithMoneyFormat } from '../types';
import { of as taskOf } from 'folktale/concurrency/task';

export { default as RateCacheImpl } from './repo/impl/RateCache';

export type RatesMgetService = Service<
  RateMgetParams & WithMoneyFormat,
  RateWithPairIds[]
>;

export default function ({
  drivers,
  cache,
  assets,
  pairs,
  pairAcceptanceVolumeThreshold,
}: RateSerivceCreatorDependencies): RatesMgetService {
  const estimator = new RateEstimator(
    cache,
    new RemoteRateRepo(drivers.pg),
    pairs,
    pairAcceptanceVolumeThreshold,
    assets
  );

  return (request: RateMgetParams & WithMoneyFormat) =>
    estimator
      .mget(request)
      .map((data) =>
        data.map((item) => ({
          rate: item.res.fold(
            () => new BigNumber(0),
            (it) => it.rate
          ),
          amountAsset: item.req.amountAsset.id,
          priceAsset: item.req.priceAsset.id,
        }))
      )
      .chain((items) =>
        request.moneyFormat === MoneyFormat.Long
          ? taskOf(
              items.map((r) => ({
                ...r,
                rate: r.rate.decimalPlaces(0),
              }))
            )
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
                  rate: item.rate
                    .multipliedBy(10 ** (-8 - precisions[1] + precisions[0]))
                    .decimalPlaces(8 + precisions[1] - precisions[0]),
                }))
              )
      );
}
