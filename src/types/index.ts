import createNamedType from './createNamedType';
import { Maybe } from 'folktale/maybe';
import { Interval, interval, div } from './interval';

export const fromMaybe = <A, B>(factory: (a?: A) => B) => (mb: Maybe<A>) =>
  mb.matchWith({
    Just: ({ value }) => factory(value),
    Nothing: () => factory(),
  });

export type TransactionData = {};

export const asset = createNamedType('asset');
export const alias = createNamedType('alias');
export const candle = createNamedType('candle');
export const pair = createNamedType('pair');
export const transaction = createNamedType<TransactionData>('transaction');
export { List, list } from './list';
export { Interval, interval, div as intervalDiv };
