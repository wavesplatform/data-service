import { Maybe, fromNullable } from 'folktale/maybe';
import { path } from 'ramda';
import { Asset, BigNumber } from '@waves/data-entities';

import { CacheSync } from '../../../../types';
import { flip, pairHasWaves } from '../../data';
import { inv, invOnSatoshi, safeDivide } from '../../util';
import { isDefined, map2 } from '../../../../utils/fp/maybeOps';
import { MoneyFormat } from '../../../../services/types';
import {
  AssetPair,
  VolumeAwareRateInfo,
  RateWithPair,
} from '../../RateEstimator';

type RateLookupTable = {
  [amountAsset: string]: {
    [priceAsset: string]: VolumeAwareRateInfo;
  };
};

type AssetPairWithMoneyFormat = AssetPair & {
  moneyFormat: MoneyFormat;
};

/*
   find rate data from RateLookupTable using the following strategy:
   
   lookup(amountAsset, priceAsset) || ( lookup(amountAsset, waves) / lookup(priceAsset, waves) }
   
   where lookup = getFromTable(asset1, asset2) || 1 / getFromtable(asset2, asset1)   
*/
export default class RateInfoLookup
  implements Omit<CacheSync<AssetPairWithMoneyFormat, RateWithPair>, 'set'> {
  private readonly lookupTable: RateLookupTable;

  constructor(
    data: Array<VolumeAwareRateInfo>,
    private readonly mPairAcceptanceVolumeThreshold: Maybe<BigNumber>,
    private readonly wavesAsset: Asset
  ) {
    this.lookupTable = this.toLookupTable(data);
  }

  has(pairWithMoneyFormat: AssetPairWithMoneyFormat): boolean {
    return isDefined(this.get(pairWithMoneyFormat));
  }

  get(
    pairWithMoneyFormat: AssetPairWithMoneyFormat
  ): Maybe<VolumeAwareRateInfo> {
    const lookup = (pair: AssetPair, flipped: boolean) =>
      this.getFromLookupTable(pair, flipped, pairWithMoneyFormat.moneyFormat);

    if (pairHasWaves(pairWithMoneyFormat)) {
      return lookup(pairWithMoneyFormat, false).orElse(() =>
        lookup(pairWithMoneyFormat, true)
      );
    }

    return lookup(pairWithMoneyFormat, false)
      .orElse(() => lookup(pairWithMoneyFormat, true))
      .filter((val) => val.volumeWaves !== null && this.mPairAcceptanceVolumeThreshold.matchWith({
        Just: ({ value: pairAcceptanceVolumeThreshold }) => val.volumeWaves.gte(pairAcceptanceVolumeThreshold),
        // lookup through waves
        Nothing: () => false
      }))
      .orElse(() =>
        this.lookupThroughWaves(this.wavesAsset, pairWithMoneyFormat)
      );
  }

  private toLookupTable(data: Array<VolumeAwareRateInfo>): RateLookupTable {
    return data.reduce<RateLookupTable>((acc, item) => {
      if (!(item.amountAsset.id in acc)) {
        acc[item.amountAsset.id] = {};
      }

      acc[item.amountAsset.id][item.priceAsset.id] = item;

      return acc;
    }, {});
  }

  private getFromLookupTable(
    pair: AssetPair,
    flipped: boolean,
    moneyFormat: MoneyFormat
  ): Maybe<VolumeAwareRateInfo> {
    const lookupData = flipped ? flip(pair) : pair;

    let foundValue = fromNullable<VolumeAwareRateInfo>(
      path(
        [lookupData.amountAsset.id, lookupData.priceAsset.id],
        this.lookupTable
      )
    );

    return foundValue.map((data) => {
      if (flipped) {
        let flippedData = { ...data };

        if (moneyFormat === MoneyFormat.Long) {
          flippedData.rate = invOnSatoshi(flippedData.rate, 8)
            .map((r) => r.shiftedBy(8))
            .getOrElse(new BigNumber(0));
        } else {
          flippedData.rate = inv(flippedData.rate).getOrElse(new BigNumber(0));
        }

        return flippedData;
      } else {
        return data;
      }
    });
  }

  private lookupThroughWaves(
    wavesAsset: Asset,
    pair: AssetPairWithMoneyFormat
  ): Maybe<VolumeAwareRateInfo> {
    return map2(
      (info1, info2) => ({
        ...pair,
        rate: safeDivide(info1.rate, info2.rate)
          .map((r) =>
            pair.moneyFormat === MoneyFormat.Long
              ? r.shiftedBy(8).decimalPlaces(0)
              : r
          )
          .getOrElse(new BigNumber(0)),
        volumeWaves: BigNumber.max(info1.volumeWaves, info2.volumeWaves),
      }),
      this.get({
        amountAsset: pair.amountAsset,
        priceAsset: wavesAsset,
        moneyFormat: pair.moneyFormat,
      }),
      this.get({
        amountAsset: pair.priceAsset,
        priceAsset: wavesAsset,
        moneyFormat: pair.moneyFormat,
      })
    );
  }
}
