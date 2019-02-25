import createNamedType, { NamedType } from './createNamedType';
import { Maybe } from 'folktale/maybe';
import { Interval, interval } from './interval';

export const fromMaybe = <A, B>(factory: (a?: A) => B) => (mb: Maybe<A>): B =>
  mb.matchWith({
    Just: ({ value }) => factory(value),
    Nothing: () => factory(),
  });

// @todo AssetInfo
export type AssetInfo = unknown;
export type Asset = NamedType<'asset', AssetInfo>;
export const asset = (data: AssetInfo = null): Asset =>
  createNamedType('asset', data);

// @todo AliasInfo
export type AliasInfo = unknown;
export type Alias = NamedType<'alias', AliasInfo>;
export const alias = (data: AliasInfo = null): Alias =>
  createNamedType('alias', data);

// @todo CandleInfo
type CandleInfo = unknown;
type Candle = NamedType<'candle', CandleInfo>;
export const candle = (data: CandleInfo = null): Candle =>
  createNamedType('candle', data);

// @todo PairInfo
export type PairInfo = unknown;
export type Pair = NamedType<'pair', PairInfo>;
export const pair = (data: PairInfo = null): Pair =>
  createNamedType('pair', data);

// @todo TransactionInfo
export type TransactionInfo = unknown;
export type Transaction = NamedType<'transaction', TransactionInfo>;
export const transaction = (data: TransactionInfo = null): Transaction =>
  createNamedType('transaction', data);

export { List, list } from './list';
export { Interval, interval };
