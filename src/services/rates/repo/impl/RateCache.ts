import { fromNullable } from 'folktale/maybe';
import * as LRU from 'lru-cache';

import { flip } from '../../data';
import { RateCache } from '../../repo';
import { AssetPair, VolumeAwareRateInfo } from '../../RateEstimator';

export type RateCacheKey = {
  pair: AssetPair;
  matcher: string;
};

const keyFn =
  (matcher: string) =>
  (pair: AssetPair): string => {
    return `${matcher}::${pair.amountAsset.id}::${pair.priceAsset.id}`;
  };

export default class RateCacheImpl implements RateCache {
  private readonly lru: LRU<string, VolumeAwareRateInfo>;

  constructor(size: number, maxAgeMillis: number) {
    this.lru = new LRU({ max: size, maxAge: maxAgeMillis });
  }

  has(key: RateCacheKey): boolean {
    const getKey = keyFn(key.matcher);
    return this.lru.has(getKey(key.pair));
  }

  set(key: RateCacheKey, data: VolumeAwareRateInfo) {
    this.lru.set(keyFn(key.matcher)(key.pair), data);
  }

  get(key: RateCacheKey) {
    const getKey = keyFn(key.matcher);

    return fromNullable(this.lru.get(getKey(key.pair))).orElse(() =>
      fromNullable(this.lru.get(getKey(flip(key.pair))))
    );
  }
}
