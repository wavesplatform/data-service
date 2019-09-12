import { BigNumber } from '@waves/data-entities';
import { Maybe, of as maybeOf, fromNullable } from 'folktale/maybe';
import { path, complement } from 'ramda';

import { AssetIdsPair, RateInfo } from "../../../../types";
import { ReadOnlyRepo } from '../../repo';
import { WavesId, flip, pairHasWaves } from '../../data';
import { maybeIsSome, maybeMap2, inv, safeDivide } from '../../util';

type RateLookupTable = {
  [amountAsset: string]: {
    [priceAsset: string]: BigNumber
  }
};

export default class RateInfoLookup implements ReadOnlyRepo<AssetIdsPair, RateInfo> {
  private readonly lookupTable: RateLookupTable;

  constructor(data: RateInfo[]) {
    this.lookupTable = this.toLookupTable(data)
  }

  has(pair: AssetIdsPair): boolean {
    return maybeIsSome(this.get(pair))
  }

  get(pair: AssetIdsPair): Maybe<RateInfo> {
    const lookup = (pair: AssetIdsPair, flipped: boolean) =>
      this.getFromLookupTable(pair, flipped)

    return lookup(pair, false)
      .orElse(
        () => lookup(pair, true)
      ).orElse(
        () => maybeOf(pair).filter(complement(pairHasWaves)).chain(
          pair => this.lookupThroughWaves(pair)
        )
      )
  }  
  
  private toLookupTable(data: RateInfo[]): RateLookupTable {
    return data.reduce(
      (acc, item) => {
        if (!(item.amountAsset in acc)) {
          acc[item.amountAsset] = {}
        }

        acc[item.amountAsset][item.priceAsset] = item.current;

        return acc
      },
      {} as RateLookupTable
    )
  }

  private getFromLookupTable(pair: AssetIdsPair, flipped: boolean): Maybe<RateInfo> {
    const lookupData = flipped ? flip(pair) : pair

    return fromNullable(path([lookupData.amountAsset, lookupData.priceAsset], this.lookupTable))
      .map((rate: BigNumber) => flipped ? inv(rate).getOrElse(new BigNumber(0)) : rate)
      .map(
        (rate: BigNumber) => (
          {
            current: rate,
              ...lookupData
          }
        )
      )
  }

  private lookupThroughWaves(pair: AssetIdsPair): Maybe<RateInfo> {
    return maybeMap2(
      (info1, info2) => safeDivide(info1.current, info2.current),
      this.get(
        {
          amountAsset: pair.amountAsset,
          priceAsset: WavesId
        }
      ),
      this.get(
        {
          amountAsset: pair.priceAsset,
          priceAsset: WavesId
        }
      )
    ).map(rate => (
      {
        amountAsset: pair.amountAsset,
        priceAsset: pair.priceAsset,
        current: rate.getOrElse(new BigNumber(0))
      }
    ))
  }
}
