import { propEq, compose } from 'ramda';

import { withStatementTimeout } from '../../../db/driver';
import { CommonServiceDependencies } from '../..';
import {
  transaction,
  TransactionInfo,
  Transaction,
  Service,
} from '../../../types';
import { WithLimit, WithSortOrder } from '../../_common';
import { RequestWithCursor } from '../../_common/pagination';
import { getByIdPreset } from '../../presets/pg/getById';
import { mgetByIdsPreset } from '../../presets/pg/mgetByIds';
import { searchWithPaginationPreset } from '../../presets/pg/searchWithPagination';
import { inputGet } from '../../presets/pg/getById/inputSchema';
import { inputMget } from '../../presets/pg/mgetByIds/inputSchema';

import { Cursor, encode, decode } from '../_common/cursor';
import { RawTx, CommonFilters } from '../_common/types';

import {
  result as resultSchema,
  inputSearch as inputSearchSchema,
} from './schema';
import * as sql from './sql';
import * as transformTxInfo from './transformTxInfo';

type LeaseCancelTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    recipient: string;
  }>;

type LeaseCancelTxDbResponse = RawTx & {
  lease_id: string;
};

export type LeaseCancelTxsService = Service<
  string,
  string[],
  LeaseCancelTxsSearchRequest,
  Transaction
>;

export default ({
  drivers: { pg },
  emitEvent,
  timeouts,
}: CommonServiceDependencies): LeaseCancelTxsService => {
  return {
    get: getByIdPreset<
      string,
      LeaseCancelTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.leaseCancel.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({
      pg: withStatementTimeout(pg, timeouts.get, timeouts.default),
      emitEvent,
    }),

    mget: mgetByIdsPreset<
      string,
      LeaseCancelTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.leaseCancel.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema,
      transformResult: transformTxInfo,
    })({
      pg: withStatementTimeout(pg, timeouts.mget, timeouts.default),
      emitEvent,
    }),

    search: searchWithPaginationPreset<
      Cursor,
      LeaseCancelTxsSearchRequest,
      LeaseCancelTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.leaseCancel.search',
      sql: sql.search,
      inputSchema: inputSearchSchema,
      resultSchema,
      transformResult: compose(transaction, transformTxInfo),
      cursor: { decode, encode },
    })({
      pg: withStatementTimeout(pg, timeouts.search, timeouts.default),
      emitEvent,
    }),
  };
};
