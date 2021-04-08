import { BigNumber } from '@waves/data-entities';
import { Maybe, fromNullable, of as maybeOf } from 'folktale/maybe';
import { path } from 'ramda';

import { AssetIdsPair, CacheSync } from '../../../../types';
import { WavesId, flip, pairHasWaves } from '../../data';
import { inv, safeDivide } from '../../util';
import { isDefined } from '../../../../utils/fp/maybeOps';

import { RateWithPairIds } from '../../../rates';
import { VolumeAwareRateInfo } from '../../../rates/RateEstimator';

type RateLookupTable = {
  [amountAsset: string]: {
    [priceAsset: string]: VolumeAwareRateInfo;
  };
};

/*
   find rate data from RateLookupTable using the following strategy:
   
   lookup(amountAsset, priceAsset) || ( lookup(amountAsset, waves) / lookup(priceAsset, waves) }
   
   where lookup = getFromTable(asset1, asset2) || 1 / getFromtable(asset2, asset1)   
*/
export default class RateInfoLookup
  implements Omit<CacheSync<AssetIdsPair, RateWithPairIds>, 'set'> {
  private readonly lookupTable: RateLookupTable;

  constructor(
    data: Array<VolumeAwareRateInfo>,
    private readonly pairAcceptanceVolumeThreshold: BigNumber
  ) {
    this.lookupTable = this.toLookupTable(data);
  }

  has(pair: AssetIdsPair): boolean {
    return isDefined(this.get(pair));
  }

  get(pair: AssetIdsPair): Maybe<VolumeAwareRateInfo> {
    const lookup = (pair: AssetIdsPair, flipped: boolean) =>
      this.getFromLookupTable(pair, flipped);

    if (pairHasWaves(pair)) {
      return lookup(pair, false).orElse(() => lookup(pair, true));
    }

    let wavesPaired = this.lookupThroughWaves(pair);

    return lookup(pair, false)
      .orElse(() => lookup(pair, true))
      .filter(
        (val) => (val.volumeWaves !== null && val.volumeWaves.gte(this.pairAcceptanceVolumeThreshold)) ||
          wavesPaired.matchWith({
            Just: ({ value }) =>
              value.rate.matchWith({
                Just: () => false,
                Nothing: () => true,
              }),
            Nothing: () => true,
          })
      )
      .orElse(() => wavesPaired);
  }

  private toLookupTable(data: Array<VolumeAwareRateInfo>): RateLookupTable {
    return data.reduce<RateLookupTable>((acc, item) => {
      if (!(item.amountAsset in acc)) {
        acc[item.amountAsset] = {};
      }

      acc[item.amountAsset][item.priceAsset] = item;

      return acc;
    }, {});
  }

  private getFromLookupTable(
    pair: AssetIdsPair,
    flipped: boolean
  ): Maybe<VolumeAwareRateInfo> {
    const lookupData = flipped ? flip(pair) : pair;

    let foundValue = fromNullable<VolumeAwareRateInfo>(
      path([lookupData.amountAsset, lookupData.priceAsset], this.lookupTable)
    );

    return foundValue.map((data) => {
      if (flipped) {
        let flippedData = { ...data };
        flippedData.rate = flippedData.rate.chain((rate) => inv(rate));
        return flippedData;
      } else {
        return data;
      }
    });
  }

  private lookupThroughWaves(pair: AssetIdsPair): Maybe<VolumeAwareRateInfo> {
    return this.get({
      amountAsset: pair.amountAsset,
      priceAsset: WavesId,
    }).chain((info1) =>
      this.get({
        amountAsset: pair.priceAsset,
        priceAsset: WavesId,
      }).chain((info2) =>
        info1.rate.chain((rate1) =>
          info2.rate.chain((rate2) =>
            maybeOf<VolumeAwareRateInfo>({
              ...pair,
              rate: safeDivide(rate1, rate2),
              volumeWaves: BigNumber.max(info1.volumeWaves || 0, info2.volumeWaves || 0),
            })
          )
        )
      )
    );
  }
}
