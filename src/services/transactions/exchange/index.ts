import { propEq, compose } from 'ramda';
import { BigNumber } from '@waves/data-entities';

import {
  transaction,
  TransactionInfo,
  Transaction,
  Service,
} from '../../../types';
import { CommonServiceDependencies } from '../..';
import { WithLimit, WithSortOrder } from '../../_common';
import { RequestWithCursor } from '../../_common/pagination';
import { getByIdPreset } from '../../presets/pg/getById';
import { mgetByIdsPreset } from '../../presets/pg/mgetByIds';
import { searchWithPaginationPreset } from '../../presets/pg/searchWithPagination';
import { inputGet } from '../../presets/pg/getById/inputSchema';
import { inputMget } from '../../presets/pg/mgetByIds/inputSchema';

import { RawTx, CommonFilters } from '../_common/types';

import { result, inputSearch } from './schema';
import * as sql from './sql';
import transformTxInfo from './transformTxInfo';

export type ExchangeTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    matcher: string;
    orderId: string;
    amountAsset: string;
    priceAsset: string;
  }>;

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

export type ExchangeTxsService = Service<
  string,
  string[],
  ExchangeTxsSearchRequest,
  Transaction
>;

export default ({
  drivers: { pg },
  emitEvent,
}: CommonServiceDependencies): ExchangeTxsService => {
  return {
    get: getByIdPreset<
      string,
      ExchangeTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.exchange.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema: result,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset<
      string,
      ExchangeTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.exchange.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    search: searchWithPaginationPreset<
      ExchangeTxsSearchRequest,
      ExchangeTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.exchange.search',
      sql: sql.search,
      inputSchema: inputSearch,
      resultSchema: result,
      transformResult: compose(
        transaction,
        transformTxInfo
      ),
    })({ pg, emitEvent }),
  };
};
