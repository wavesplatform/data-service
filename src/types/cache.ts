import { Maybe } from 'folktale/maybe';

export type CacheSync<K, V> = {
  has(key: K): boolean;
  get(key: K): Maybe<V>;
  set(key: K, value: V): void;
};
