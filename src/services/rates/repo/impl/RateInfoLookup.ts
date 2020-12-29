import { BigNumber } from '@waves/data-entities';
import { Maybe, fromNullable } from 'folktale/maybe';
import { path } from 'ramda';

import { AssetIdsPair, CacheSync, RateWithPairIds, VolumeAwareRateInfo } from '../../../../types';
import { WavesId, flip, pairHasWaves } from '../../data';
import { inv, safeDivide } from '../../util';
import { isDefined, map2 } from '../../../../utils/fp/maybeOps';

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

  constructor(data: Array<VolumeAwareRateInfo>, private readonly pairAcceptanceVolumeThreshold: number) {
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

    return lookup(pair, false)
      .orElse(() => lookup(pair, true))
      .filter(val => val.volumeWaves.gte(this.pairAcceptanceVolumeThreshold))
      .orElse(() => this.lookupThroughWaves(pair));
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
    )

    return foundValue.map(data => flipped ? {
        ...data,
      rate: inv(data.rate).getOrElse(new BigNumber(0))
    } : data);
  }

  private lookupThroughWaves(pair: AssetIdsPair): Maybe<VolumeAwareRateInfo> {
    return map2(
      (info1, info2) => ({
          ...pair,
        rate: safeDivide(info1.rate, info2.rate).getOrElse(new BigNumber(0)),
        volumeWaves: BigNumber.max(info1.volumeWaves, info2.volumeWaves)
      }),
      this.get({
        amountAsset: pair.amountAsset,
        priceAsset: WavesId,
      }),
      this.get({
        amountAsset: pair.priceAsset,
        priceAsset: WavesId,
      })
    )
  }
}
