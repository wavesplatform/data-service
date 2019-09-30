import { propEq, compose } from 'ramda';

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
> &
  Partial<{
    recipient: string;
  }>;

type PaymentTxDbResponse = RawTx & {
  amount: string;
  recipient: string;
};

export type PaymentTxsService = Service<
  string,
  string[],
  PaymentTxsSearchRequest,
  Transaction
>;

export default ({
  drivers: { pg },
  emitEvent,
}: CommonServiceDependencies): PaymentTxsService => {
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
