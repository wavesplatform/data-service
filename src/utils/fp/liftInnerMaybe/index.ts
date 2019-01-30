import { swapMaybeF } from '../swapMaybeF';

import { Maybe } from 'folktale/maybe';
import { of as resultOf, Result } from 'folktale/result';
import { of as taskOf, Task } from 'folktale/concurrency/task';

import { map, compose } from 'ramda';

export function liftInnerMaybe<A, B>(
  F: typeof resultOf,
  fn: (b: B) => Result<A, B>,
  maybe: Maybe<B>
): Result<A, Maybe<B>>;
export function liftInnerMaybe<A, B>(
  F: typeof taskOf,
  fn: (b: B) => Task<A, B>,
  maybe: Maybe<B>
): Task<A, Maybe<B>>;
export function liftInnerMaybe(F: any, fn: any, maybe: any) {
  return compose(
    (m: any) => swapMaybeF(F, m),
    map(fn)
  )(maybe) as any;
}
