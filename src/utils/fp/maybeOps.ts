import { Maybe } from 'folktale/maybe';

export const isEmpty = <A>(ma: Maybe<A>): boolean =>
  ma.matchWith({
    Just: () => false,
    Nothing: () => true,
  });

export const isDefined = <A>(ma: Maybe<A>) => !isEmpty(ma);

export const map2 = <A, B, R>(
  fn: (a: A, b: B) => R,
  ma: Maybe<A>,
  mb: Maybe<B>
): Maybe<R> => ma.chain(a => mb.map(b => fn(a, b)));

export const forEach = <A>(f: (a: A) => void, ma: Maybe<A>): void =>
  ma.matchWith({
    Just: ({ value }) => f(value),
    Nothing: () => undefined,
  });
