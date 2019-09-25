import { Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';
import { Asset as AssetInfo, BigNumber } from '@waves/data-entities';
import { AppError } from '../errorHandling';
import { toSerializable, Serializable } from './serialization';
import { Interval, interval, Unit } from './interval';
import { List, list } from './list';

export { CacheSync } from './cache';

export { List, list };
export { Interval, interval, Unit };

export { Serializable, FromSerializable } from './serialization';

export { Without, XOR } from './generic';

export const fromMaybe = <A, B>(factory: (a?: A) => B) => (mb: Maybe<A>): B =>
  mb.matchWith({
    Just: ({ value }) => factory(value),
    Nothing: () => factory(),
  });

export type ServiceGet<
  Request,
  ResponseTransformed extends Serializable<string, any>
> = {
  readonly get: (
    request: Request
  ) => Task<AppError, Maybe<ResponseTransformed>>;
};
export type ServiceMget<
  Request,
  ResponseTransformed extends Serializable<string, any>
> = {
  readonly mget: (
    request: Request
  ) => Task<AppError, List<ResponseTransformed>>;
};
export type ServiceSearch<
  Request,
  ResponseTransformed extends Serializable<string, any>
> = {
  readonly search: (
    request: Request
  ) => Task<AppError, List<ResponseTransformed>>;
};

export type Service<
  GetRequest,
  MgetRequest,
  SearchRequest,
  Response extends Serializable<string, any>
> = ServiceGet<GetRequest, Response> &
  ServiceMget<MgetRequest, Response> &
  ServiceSearch<SearchRequest, Response>;

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
  timeStart: Date | null;
  maxHeight: number;
  open: BigNumber | null;
  high: BigNumber;
  low: BigNumber;
  close: BigNumber | null;
  volume: BigNumber;
  quoteVolume: BigNumber;
  weightedAveragePrice: BigNumber;
  txsCount: number;
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

export type Pair = Serializable<'pair', PairInfo | null> & Partial<AssetIdsPair>;
export const pair = (data: PairInfo | null, pairData: AssetIdsPair | null): Pair =>
  ({...toSerializable('pair', data), ...pairData});

// @todo TransactionInfo
export type DataTxEntryType = 'binary' | 'boolean' | 'integer' | 'string';
export type TransactionInfo = {
  id: string;
  type: number;
  timestamp: Date;
};
export type NotNullTransaction = Serializable<'transaction', TransactionInfo>;
export type Transaction = Serializable<'transaction', TransactionInfo | null>;
export const transaction = (data: TransactionInfo | null = null): Transaction =>
  toSerializable('transaction', data);

export type AssetIdsPair = {
  amountAsset: string;
  priceAsset: string;
};

export type RateMgetParams = {
  pairs: AssetIdsPair[];
  matcher: string;
  timestamp: Maybe<Date>;
};

export type RateGetParams = {
  pair: AssetIdsPair;
  matcher: string;
  timestamp: Maybe<Date>;
};

export type RateInfo = {
  rate: BigNumber;
};
export type Rate = Serializable<'rate', RateInfo | null> & AssetIdsPair;
export const rate = (data: RateInfo | null, assetMeta: AssetIdsPair): Rate =>
  ({...toSerializable('rate', data === null ? null : data), ...assetMeta});
