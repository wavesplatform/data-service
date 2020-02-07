import { Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';
import { Asset as AssetInfo, BigNumber } from '@waves/data-entities';
import { AppError } from '../errorHandling';
import { toSerializable, Serializable } from './serializable';
import { Interval, interval, Unit } from './interval';
import { List, list } from './list';
import { IncomingHttpHeaders } from 'http';
import { DecimalsFormat } from '../services/types';

export { CacheSync } from './cache';

export { List, list };
export { Interval, interval, Unit };

export { Serializable, FromSerializable } from './serializable';

export { Without, XOR } from './generic';

export const fromMaybe = <A, B>(factory: (a?: A) => B) => (mb: Maybe<A>): B =>
  mb.matchWith({
    Just: ({ value }) => factory(value),
    Nothing: () => factory(),
  });

export const WITH_DECIMALS_HEADER = 'x-with-decimals';

export type RequestHeaders = IncomingHttpHeaders &
  Partial<{
    WITH_DECIMALS_HEADER: DecimalsFormat;
  }>;

export type Items<Item> = {
  items: Item[];
};

export type SearchedItems<Item> = Items<Item> & {
  lastCursor?: string;
  isLastPage: boolean;
};

export type ServiceGetRequest<Id = string> = { id: Id };
export type ServiceMgetRequest<Ids = string[]> = { ids: Ids };

export type Service<Request, Response> = (
  request: Request
) => Task<AppError, Response>;

export type RepoGetResponse<Response> = Maybe<Response>;
export type RepoGet<Request, Response> = {
  readonly get: (request: Request) => Task<AppError, RepoGetResponse<Response>>;
};

export type RepoMgetResponse<Response> = Maybe<Response>[];
export type RepoMget<Request, Response> = {
  readonly mget: (
    request: Request
  ) => Task<AppError, RepoMgetResponse<Response>>;
};

export type RepoSearchResponse<Response> = SearchedItems<Response>;
export type RepoSearch<Request, Response> = {
  readonly search: (
    request: Request
  ) => Task<AppError, RepoSearchResponse<Response>>;
};

export type Repo<GetRequest, MgetRequest, SearchRequest, Response> = RepoGet<
  GetRequest,
  Response
> &
  RepoMget<MgetRequest, Response> &
  RepoSearch<SearchRequest, Response>;

export type RepoResponse<Response> =
  | Maybe<Response>
  | Maybe<Response>[]
  | RepoSearchResponse<Response>;

export { AssetInfo };
export type Asset = Serializable<'asset', AssetInfo>;
export const asset = (data: AssetInfo | null = null): Asset =>
  toSerializable('asset', data);

export type AliasInfo = {
  alias: string;
  address: string | null;
};
export type Alias = Serializable<'alias', AliasInfo>;
export const alias = (data: AliasInfo | null): Alias =>
  toSerializable('alias', data);

export type CandleInfo = {
  time: Date;
  timeClose: Date;
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

export enum CandleInterval {
  Minute1 = '1m',
  Minute5 = '5m',
  Minute15 = '15m',
  Minute30 = '30m',
  Hour1 = '1h',
  Hour2 = '2h',
  Hour3 = '3h',
  Hour4 = '4h',
  Hour6 = '6h',
  Hour12 = '12h',
  Day1 = '1d',
  Week1 = '1w',
  Month1 = '1M',
}

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

export type Pair = Serializable<'pair', PairInfo | null> &
  Partial<AssetIdsPair>;
export const pair = (
  data: PairInfo | null,
  pairData: AssetIdsPair | null
): Pair => ({ ...toSerializable('pair', data), ...pairData });

// @todo TransactionInfo
export enum DataEntryType {
  Binary = 'binary',
  Boolean = 'boolean',
  Integer = 'integer',
  String = 'string',
}
export type TransactionInfo = {
  id: string;
  timestamp: Date;
  type: number;
};
export type CommonTransactionInfo = TransactionInfo & {
  tx_uid: BigNumber;
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
export type RateWithPairIds = RateInfo & AssetIdsPair;
export type Rate = Serializable<'rate', RateInfo | null> & AssetIdsPair;
export const rate = (data: RateInfo | null, assetMeta: AssetIdsPair): Rate => ({
  ...toSerializable('rate', data === null ? null : data),
  ...assetMeta,
});
