import { fromNullable } from 'folktale/maybe';
import * as LRU from 'lru-cache';

import { AssetIdsPair, VolumeAwareRateInfo } from '../../../../types';
import { inv } from '../../util';
import { flip } from '../../data';
import { RateCache } from '../../repo';

export type RateCacheKey = {
  pair: AssetIdsPair;
  matcher: string;
};

const keyFn = (matcher: string) => (pair: AssetIdsPair): string => {
  return `${matcher}::${pair.amountAsset}::${pair.priceAsset}`;
};

export default class RateCacheImpl implements RateCache {
  private readonly lru: LRU<string, VolumeAwareRateInfo>;

  constructor(size: number, maxAgeMillis: number) {
    this.lru = new LRU({ max: size, maxAge: maxAgeMillis });
  }

  has(key: RateCacheKey): boolean {
    const getKey = keyFn(key.matcher);
    return (
      this.lru.has(getKey(key.pair)) || this.lru.has(getKey(flip(key.pair)))
    );
  }

  set(key: RateCacheKey, data: VolumeAwareRateInfo) {
    this.lru.set(keyFn(key.matcher)(key.pair), data);
  }

  get(key: RateCacheKey) {
    const getKey = keyFn(key.matcher);

    return fromNullable(this.lru.get(getKey(key.pair))).orElse(
      () => fromNullable(this.lru.get(getKey(flip(key.pair)))).chain(
        it => inv(it.rate).map(rate => ({ ...it, rate }))
      )
    );
  }
}
