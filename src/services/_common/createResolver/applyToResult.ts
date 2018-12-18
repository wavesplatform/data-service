import { AppError } from 'errorHandling/AppError';
import { Maybe } from 'folktale/maybe';
import { of as resultOf, Result } from 'folktale/result';
import { liftInnerMaybe } from 'utils/fp/liftInnerMaybe';
import { traverse } from 'ramda';

export const applyToGetResult = <A>(fn: (a: A) => Result<AppError, A>) => (
  m: Maybe<A>
) => liftInnerMaybe(resultOf, fn, m);
export const applyToMgetResult = <A>(fn: (a: A) => Result<AppError, A>) => (
  ms: Maybe<A>[]
): Result<AppError, Maybe<A>[]> =>
  traverse(resultOf, (m: Maybe<A>) => liftInnerMaybe(resultOf, fn, m), ms);
export const applyToSearchResult = <A>(fn: (a: A) => Result<AppError, A>) => (
  as: A[]
): Result<AppError, A[]> => traverse(resultOf, fn, as);
