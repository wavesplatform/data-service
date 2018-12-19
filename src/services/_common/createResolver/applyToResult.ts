import { Maybe } from 'folktale/maybe';
import { of as resultOf, Result } from 'folktale/result';
import { liftInnerMaybe } from '../../../utils/fp/';
import { traverse } from 'ramda';

export namespace applyValidation {
  export const get = <E, A>(fn: (a: A) => Result<E, A>) => (m: Maybe<A>) =>
    liftInnerMaybe(resultOf, fn, m);
  export const mget = <E, A>(fn: (a: A) => Result<E, A>) => (
    ms: Maybe<A>[]
  ): Result<E, Maybe<A>[]> =>
    traverse(resultOf, (m: Maybe<A>) => liftInnerMaybe(resultOf, fn, m), ms);
  export const search = <E, A>(fn: (a: A) => Result<E, A>) => (
    as: A[]
  ): Result<E, A[]> => traverse(resultOf, fn, as);
}

export namespace applyTransformation {
  export const get = <A, B>(fn: (a: A) => B) => (m: Maybe<A>): B | null =>
    m.map(fn).getOrElse(null);
  export const mget = <A, B>(fn: (a: A) => B) => (
    ms: Maybe<A>[]
  ): (B | null)[] => ms.map(applyTransformation.get(fn));
  export const search = <A, B>(fn: (a: A) => B) => (as: A[]): B[] => as.map(fn);
}
