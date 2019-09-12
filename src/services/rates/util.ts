import { Maybe, of as maybeOf } from 'folktale/maybe';

import { BigNumber } from '@waves/data-entities';

import { complement, always } from 'ramda';

export function safeDivide(n1: BigNumber, n2: BigNumber): Maybe<BigNumber> {
  return maybeOf(n2)
    .filter(it => !it.isZero())
    .map(it => n1.div(it));
}

export const inv = (n: BigNumber) => safeDivide(new BigNumber(1), n);

export const maybeIsNone = <T>(data: Maybe<T>) => {
  return data.matchWith({
    Just: always(false),
    Nothing: always(true),
  });
};

export const maybeIsSome = complement(maybeIsNone);

export const maybeMap2 = <T1, T2, R>(
  fn: (v1: T1, v2: T2) => R,
  v1: Maybe<T1>,
  v2: Maybe<T2>
): Maybe<R> => v1.chain(v1 => v2.map(v2 => fn(v1, v2)));

export type Deconstruct<T, Components> = (value: T) => Components;

export const isSymmetric = <T, P>(byFn: Deconstruct<T, [P, P]>) => (
  item: T
) => {
  const [p1, p2] = byFn(item);

  return p1 === p2;
};
