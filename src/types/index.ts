import { toSerializable, Serializable } from './serialization';
import { Maybe } from 'folktale/maybe';
import { Interval, interval, Unit } from './interval';
import { Balance as GrpcBalance } from '../protobuf/balances';
import { DataEntryResponse as GrpcDataEntryResponse } from '../protobuf/data-entries';

export { Serializable, FromSerializable } from './serialization';
import { List } from './list';

export const fromMaybe = <A, B>(factory: (a?: A) => B) => (mb: Maybe<A>): B =>
  mb.matchWith({
    Just: ({ value }) => factory(value),
    Nothing: () => factory(),
  });

// @todo AssetInfo
export type AssetInfo = unknown;
export type Asset = Serializable<'asset', AssetInfo>;
export const asset = (data: AssetInfo = null): Asset =>
  toSerializable('asset', data);

// @todo AliasInfo
export type AliasInfo = unknown;
export type Alias = Serializable<'alias', AliasInfo>;
export const alias = (data: AliasInfo = null): Alias =>
  toSerializable('alias', data);

// @todo CandleInfo
type CandleInfo = unknown;
type Candle = Serializable<'candle', CandleInfo>;
export const candle = (data: CandleInfo = null): Candle =>
  toSerializable('candle', data);

// @todo PairInfo
export type PairInfo = unknown;
export type Pair = Serializable<'pair', PairInfo>;
export const pair = (data: PairInfo = null): Pair =>
  toSerializable('pair', data);

// @todo TransactionInfo
export type TransactionInfo = unknown;
export type Transaction = Serializable<'transaction', TransactionInfo>;
export const transaction = (data: TransactionInfo = null): Transaction =>
  toSerializable('transaction', data);

// @todo BalanceInfo
export type BalanceInfo = unknown;
export type Balance = Serializable<'balance', BalanceInfo>;
export const balance = (data: BalanceInfo = null): Balance =>
  toSerializable('balance', data);

// @todo DataEntryInfo
export type DataEntryInfo = unknown;
export type DataEntry = Serializable<'dataEntry', DataEntryInfo>;
export const dataEntry = (data: DataEntryInfo = null): DataEntry =>
  toSerializable('dataEntry', data);

// @todo StateUpdateInfo
export type StateUpdate = {
  balances: GrpcBalance[];
  dataEntries: GrpcDataEntryResponse[];
};
export type StateUpdateInfo = {
  balances: List<BalanceInfo>;
  dataEntries: List<DataEntryInfo>;
};
export type SerializableStateUpdate = Serializable<
  'stateUpdate',
  StateUpdateInfo | null
>;
export const stateUpdate = (
  data: StateUpdateInfo | null = null
): SerializableStateUpdate => toSerializable('stateUpdate', data);

export { List, list } from './list';
export { Interval, interval, Unit };
