import { of as maybeOf, empty, Maybe } from 'folktale/maybe';
import { of as resultOf, Result } from 'folktale/result';
import { of as taskOf, Task } from 'folktale/concurrency/task';

export function swapMaybeF<A, B>(
  F: typeof resultOf,
  maybe: Maybe<Result<A, B>>
): Result<A, Maybe<B>>;
export function swapMaybeF<A, B>(
  F: typeof taskOf,
  maybe: Maybe<Task<A, B>>
): Task<A, Maybe<B>>;
export function swapMaybeF(F: any, maybe: Maybe<any>): any {
  return maybe.matchWith({
    Nothing: () => F(empty()),
    Just: ({ value }) => value.map(maybeOf),
  });
}
