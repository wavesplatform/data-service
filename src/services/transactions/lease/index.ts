import { propEq, compose } from 'ramda';
import { BigNumber } from '@waves/data-entities';

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
import { transformTxInfo } from '../_common/transformTxInfo';

import {
  result as resultSchema,
  inputSearch as inputSearchSchema,
} from './schema';
import * as sql from './sql';

type LeaseTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    recipient: string;
  }>;

type LeaseTxDbResponse = RawTx & {
  amount: BigNumber;
  recipient: string;
};

export type LeaseTxsService = Service<
  string,
  string[],
  LeaseTxsSearchRequest,
  Transaction
>;

export default ({
  drivers: { pg },
  emitEvent,
  timeouts,
}: CommonServiceDependencies): LeaseTxsService => {
  return {
    get: getByIdPreset<string, LeaseTxDbResponse, TransactionInfo, Transaction>(
      {
        name: 'transactions.lease.get',
        sql: sql.get,
        inputSchema: inputGet,
        resultSchema,
        resultTypeFactory: transaction,
        transformResult: transformTxInfo,
      }
    )({
      pg: withStatementTimeout(pg, timeouts.get, timeouts.default),
      emitEvent,
    }),

    mget: mgetByIdsPreset<
      string,
      LeaseTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.lease.mget',
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
      LeaseTxsSearchRequest,
      LeaseTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.lease.search',
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
