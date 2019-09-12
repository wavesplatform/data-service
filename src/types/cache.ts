import { DbError } from 'errorHandling';
import { Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';

export type Cache<K, V> = {
  get(key: K): Task<DbError, Maybe<V>>;
  set(key: K, value: V): Task<DbError, void>;
};
