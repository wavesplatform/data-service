import { propEq, compose } from 'ramda';

import {
  transaction,
  TransactionInfo,
  Transaction,
  ServiceGet,
  ServiceMget,
  ServiceSearch,
} from '../../../types';
import { CommonServiceCreatorDependencies } from '../..';
import { WithLimit, WithSortOrder } from '../../_common';
import { RequestWithCursor } from '../../_common/pagination';
import { getByIdPreset } from '../../presets/pg/getById';
import { mgetByIdsPreset } from '../../presets/pg/mgetByIds';
import { searchWithPaginationPreset } from '../../presets/pg/searchWithPagination';
import { inputGet } from '../../presets/pg/getById/inputSchema';
import { inputMget } from '../../presets/pg/mgetByIds/inputSchema';

import { transformTxInfo } from '../_common/transformTxInfo';
import { RawTx, CommonFilters } from '../_common/types';

import {
  result as resultSchema,
  inputSearch as inputSearchSchema,
} from './schema';
import * as sql from './sql';

type PaymentTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
>;

type PaymentTxDbResponse = RawTx & {
  asset_id: string;
  amount: string;
};

export type PaymentTxsService = ServiceGet<string, Transaction> &
  ServiceMget<string[], Transaction> &
  ServiceSearch<PaymentTxsSearchRequest, Transaction>;

export default ({
  drivers: { pg },
  emitEvent,
}: CommonServiceCreatorDependencies): PaymentTxsService => {
  return {
    get: getByIdPreset<
      string,
      PaymentTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.payment.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset<
      string,
      PaymentTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.payment.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    search: searchWithPaginationPreset<
      PaymentTxsSearchRequest,
      PaymentTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.payment.search',
      sql: sql.search,
      inputSchema: inputSearchSchema,
      resultSchema,
      transformResult: compose(
        transaction,
        transformTxInfo
      ),
    })({ pg, emitEvent }),
  };
};
