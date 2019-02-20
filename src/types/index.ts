import createNamedType from './createNamedType';
import { Maybe } from 'folktale/maybe';
import Interval from './interval';

export const fromMaybe = <A, B>(factory: (a?: A) => B, mb: Maybe<A>) =>
  mb.matchWith({
    Just: ({ value }) => factory(value),
    Nothing: () => factory(),
  });

export type TransactionData = {};

export const Asset = createNamedType('asset');
export const Alias = createNamedType('alias');
export const Candle = createNamedType('candle');
export const Pair = createNamedType('pair');
export const Transaction = createNamedType<TransactionData>('transaction');
export { List, list } from './list';
export { Interval };
