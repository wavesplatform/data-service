import { Repo } from '../../../../types';
import { WithSortOrder, WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { CommonFilters, RawTx, Tx } from '../../_common/types';
import { BigNumber } from '@waves/data-entities';

export type ExchangeTxDbResponse = RawTx & {
  price_asset: string;
  amount_asset: string;
  price: BigNumber;
  amount: BigNumber;
  buy_matcher_fee: BigNumber;
  sell_matcher_fee: BigNumber;

  o1_id: string;
  o1_version: string;
  o1_type: string;
  o1_sender: string;
  o1_sender_public_key: string;
  o1_signature: string;
  o1_matcher_fee: BigNumber;
  o1_price: BigNumber;
  o1_amount: BigNumber;
  o1_time_stamp: string;
  o1_expiration: string;
  o1_matcher_fee_asset_id: string;

  o2_id: string;
  o2_version: string;
  o2_type: string;
  o2_sender: string;
  o2_sender_public_key: string;
  o2_signature: string;
  o2_matcher_fee: BigNumber;
  o2_price: BigNumber;
  o2_amount: BigNumber;
  o2_time_stamp: Date;
  o2_expiration: Date;
  o2_matcher_fee_asset_id: string;
};

export enum OrderType {
  Buy = 'buy',
  Sell = 'sell',
}

type Order = {
  id: string;
  version: string;
  orderType: OrderType;
  sender: string;
  senderPublicKey: string;
  signature: string;
  matcherFee: BigNumber;
  price: BigNumber;
  amount: BigNumber;
  timestamp: string;
  expiration: string;
  matcherFeeAssetId: string;
  assetPair: {
    amountAsset: string;
    priceAsset: string;
  }
};

export type ExchangeTx = Tx & {
  price: BigNumber;
  amount: BigNumber;
  buyMatcherFee: BigNumber;
  sellMatcherFee: BigNumber;

  order1: Order;
  order2: Order;
};

export type ExchangeTxsGetRequest = string;

export type ExchangeTxsMgetRequest = string[];

export type ExchangeTxsSearchRequest = RequestWithCursor<
  CommonFilters &
    WithSortOrder &
    WithLimit &
    Partial<{
      matcher: string;
      orderId: string;
      amountAsset: string;
      priceAsset: string;
    }>,
  string
>;

export type ExchangeTxsRepo = Repo<
  ExchangeTxsGetRequest,
  ExchangeTxsMgetRequest,
  ExchangeTxsSearchRequest,
  ExchangeTx
>;
