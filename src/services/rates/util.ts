import { Maybe, of as maybeOf } from 'folktale/maybe';

import { BigNumber } from '@waves/data-entities';

export function safeDivide(n1: BigNumber, n2: BigNumber): Maybe<BigNumber> {
  return maybeOf(n2)
    .filter(it => !it.isZero())
    .map(it => n1.div(it));
}

export const inv = (n: BigNumber) => safeDivide(new BigNumber(1), n);

export type Deconstruct<T, Components> = (value: T) => Components;

export const isSymmetric = <T, P>(byFn: Deconstruct<T, [P, P]>) => (
  item: T
) => {
  const [p1, p2] = byFn(item);

  return p1 === p2;
};
