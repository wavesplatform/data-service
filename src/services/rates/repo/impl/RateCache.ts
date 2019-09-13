import { BigNumber } from '@waves/data-entities';
import { Maybe, fromNullable } from 'folktale/maybe';
import * as LRU from 'lru-cache';

import { tap } from '../../../../utils/tap';
import { AssetIdsPair } from '../../../../types';
import { inv } from '../../util';
import { flip } from '../../data';
import { Cache } from '../../repo';

export type RateCacheKey = {
  pair: AssetIdsPair;
  matcher: string;
};

const keyFn = (matcher: string) => (pair: AssetIdsPair): string => {
  return `${matcher}::${pair.amountAsset}::${pair.priceAsset}`;
};

export default class RateCache
  implements Cache<Maybe<RateCacheKey>, BigNumber> {
  constructor(private readonly lru: LRU<string, BigNumber>) {}

  has(key: Maybe<RateCacheKey>): boolean {
    return key
      .map(key => {
        const getKey = keyFn(key.matcher);

        return (
          this.lru.has(getKey(key.pair)) || this.lru.has(getKey(flip(key.pair)))
        );
      })
      .getOrElse(false);
  }

  put(key: Maybe<RateCacheKey>, rate: BigNumber) {
    key.map(tap(key => this.lru.set(keyFn(key.matcher)(key.pair), rate)));
  }

  get(key: Maybe<RateCacheKey>) {
    return key.chain(key => {
      const getKey = keyFn(key.matcher);

      return fromNullable(this.lru.get(getKey(key.pair))).orElse(() =>
        fromNullable(this.lru.get(getKey(flip(key.pair)))).chain(inv)
      );
    });
  }
}
