import { BigNumber } from '@waves/data-entities';
import { Maybe, of as maybeOf, fromNullable } from 'folktale/maybe';
import { path, complement } from 'ramda';

import { AssetIdsPair, CacheSync } from '../../../../types';
import { WavesId, flip, pairHasWaves } from '../../data';
import { inv, safeDivide } from '../../util';
import { isDefined, map2 } from '../../../../utils/fp/maybeOps';

import { RateWithPairIds } from '../../../rates'

type RateLookupTable = {
  [amountAsset: string]: {
    [priceAsset: string]: BigNumber;
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

  constructor(data: Array<RateWithPairIds>) {
    this.lookupTable = this.toLookupTable(data);
  }

  has(pair: AssetIdsPair): boolean {
    return isDefined(this.get(pair));
  }

  get(pair: AssetIdsPair): Maybe<RateWithPairIds> {
    const lookup = (pair: AssetIdsPair, flipped: boolean) =>
      this.getFromLookupTable(pair, flipped);

    return lookup(pair, false)
      .orElse(() => lookup(pair, true))
      .orElse(() =>
        maybeOf(pair)
          .filter(complement(pairHasWaves))
          .chain(pair => this.lookupThroughWaves(pair))
      );
  }

  private toLookupTable(data: Array<RateWithPairIds>): RateLookupTable {
    return data.reduce<RateLookupTable>((acc, item) => {
      if (!(item.amountAsset in acc)) {
        acc[item.amountAsset] = {};
      }

      acc[item.amountAsset][item.priceAsset] = item.rate;

      return acc;
    }, {});
  }

  private getFromLookupTable(
    pair: AssetIdsPair,
    flipped: boolean
  ): Maybe<RateWithPairIds> {
    const lookupData = flipped ? flip(pair) : pair;

    return fromNullable<BigNumber>(
      path([lookupData.amountAsset, lookupData.priceAsset], this.lookupTable)
    )
      .map((rate: BigNumber) =>
        flipped ? inv(rate).getOrElse(new BigNumber(0)) : rate
      )
      .map((rate: BigNumber) => ({
        rate,
        ...lookupData,
      }));
  }

  private lookupThroughWaves(pair: AssetIdsPair): Maybe<RateWithPairIds> {
    return map2(
      (info1, info2) => safeDivide(info1.rate, info2.rate),
      this.get({
        amountAsset: pair.amountAsset,
        priceAsset: WavesId,
      }),
      this.get({
        amountAsset: pair.priceAsset,
        priceAsset: WavesId,
      })
    ).map(rate => ({
      amountAsset: pair.amountAsset,
      priceAsset: pair.priceAsset,
      rate: rate.getOrElse(new BigNumber(0)),
    }));
  }
}
