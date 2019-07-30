import { Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';
import { BigNumber } from '@waves/bignumber';
import { Asset as AssetInfo } from '@waves/data-entities';
import { AppError } from '../errorHandling';
import { toSerializable, Serializable } from './serialization';
import { Interval, interval, Unit } from './interval';
import { List, list } from './list';

export { List, list };
export { Interval, interval, Unit };

export { Serializable, FromSerializable } from './serialization';

export const fromMaybe = <A, B>(factory: (a?: A) => B) => (mb: Maybe<A>): B =>
  mb.matchWith({
    Just: ({ value }) => factory(value),
    Nothing: () => factory(),
  });

export type ServiceGet<
  Request,
  ResponseTransformed extends Serializable<string, any>
> = {
  get: (request: Request) => Task<AppError, Maybe<ResponseTransformed>>;
};
export type ServiceMget<
  Request,
  ResponseTransformed extends Serializable<string, any>
> = {
  mget: (request: Request) => Task<AppError, List<ResponseTransformed>>;
};
export type ServiceSearch<
  Request,
  ResponseTransformed extends Serializable<string, any>
> = {
  search: (request: Request) => Task<AppError, List<ResponseTransformed>>;
};

export type Service<T extends Serializable<string, any>> =
  | ServiceGet<any, T>
  | ServiceMget<any, T>
  | ServiceSearch<any, T>;

export { AssetInfo };
export type Asset = Serializable<'asset', AssetInfo | null>;
export const asset = (data: AssetInfo | null = null): Asset =>
  toSerializable('asset', data);

export type AliasInfo = {
  alias: string;
  address: string | null;
};
export type Alias = Serializable<'alias', AliasInfo | null>;
export const alias = (data: AliasInfo | null = null): Alias =>
  toSerializable('alias', data);

export type CandleInfo = {
  time_start: Date | null;
  matcher: string | null;
  max_height: number;
  open: BigNumber | null;
  high: BigNumber;
  low: BigNumber;
  close: BigNumber | null;
  volume: BigNumber;
  quote_volume: BigNumber;
  weighted_average_price: BigNumber;
  txs_count: number;
  interval_in_secs: number | null;
  a_dec: number | null;
  p_dec: number | null;
};
export type Candle = Serializable<'candle', CandleInfo | null>;
export const candle = (data: CandleInfo | null = null): Candle =>
  toSerializable('candle', data);

export type PairInfo = {
  firstPrice: BigNumber;
  lastPrice: BigNumber;
  low: BigNumber;
  high: BigNumber;
  weightedAveragePrice: BigNumber;
  volume: BigNumber;
  quoteVolume: BigNumber;
  volumeWaves: BigNumber;
  txsCount: number;
};
export type Pair = Serializable<'pair', PairInfo | null>;
export const pair = (data: PairInfo | null = null): Pair =>
  toSerializable('pair', data);

// @todo TransactionInfo
export type TransactionInfo = {
  id: string;
  timestamp: Date;
};
export type Transaction = Serializable<'transaction', TransactionInfo | null>;
export const transaction = (data: TransactionInfo | null = null): Transaction =>
  toSerializable('transaction', data);


export type RateGetParams = { amountAsset: string, priceAsset: string, matcher: string }
export type Rate = Serializable<'BigNumber', string | null>;
export const rate = (data: BigNumber | null = null): Rate => toSerializable('BigNumber', data === null ? null : data.toString())
