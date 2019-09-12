import { Maybe,
         fromNullable,
         of as maybeOf,
       } from 'folktale/maybe';
import { path, complement } from 'ramda';
import * as LRU from 'lru-cache';
import { AssetIdsPair, RateInfo } from '../../types';
import { BigNumber } from '@waves/data-entities';
import { inv, safeDivide, maybeMap2, maybeIsSome } from './util';
import { flip, WavesId, pairHasWaves } from './data'
import { tap } from "../../utils/tap";

export type ReadOnlyRepo<K, V> = {
  has: (key: K) => boolean,
  get: (key: K) => Maybe<V>
}

export type Repo<K, V> = ReadOnlyRepo<K, V> & {
  put: (key: K, value: V) => void
}

export type RateCacheKey = {
  pair: AssetIdsPair,
  matcher: string
}

const keyFn = (matcher: string) => (pair: AssetIdsPair): string => {
  return `${matcher}::${pair.amountAsset}::${pair.priceAsset}`
}
  
export class RateCache implements Repo<Maybe<RateCacheKey>, BigNumber> {
  constructor(
    private readonly lru: LRU<string, BigNumber>
  ) {}
  
  has(key: Maybe<RateCacheKey>): boolean {
    return key.map(
      key => {
        const getKey = keyFn(key.matcher)
        
        return this.lru.has(getKey(key.pair)) || this.lru.has(getKey(flip(key.pair)))
      }
    ).getOrElse(false)
  }
  
  put(key: Maybe<RateCacheKey>, rate: BigNumber) {
    key.map(
      tap(key => this.lru.set(keyFn(key.matcher)(key.pair), rate))
    )
  }
  
  get(key: Maybe<RateCacheKey>) {
    return key.chain(
      key => {
        const getKey = keyFn(key.matcher)
        
        return fromNullable(this.lru.get(getKey(key.pair))).orElse(
          () => fromNullable(this.lru.get(getKey(flip(key.pair)))).chain(inv)
        )
      }
    )
  }  
}

type RateLookupTable = {
  [amountAsset: string]: {
    [priceAsset: string]: BigNumber
  }
};

export class RateInfoLookup implements ReadOnlyRepo<AssetIdsPair, RateInfo> {
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
