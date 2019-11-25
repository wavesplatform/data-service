import { propEq, compose } from 'ramda';

import { withStatementTimeout } from '../../../db/driver';
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

import { Cursor, encode, decode } from '../_common/cursor';
import { RawTx, CommonFilters } from '../_common/types';

import {
  result as resultSchema,
  inputSearch as inputSearchSchema,
} from './schema';
import * as sql from './sql';
import transformTxInfo from './transformTxInfo';

type BurnTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    assetId: string;
  }>;

type BurnTxDbResponse = RawTx & {
  asset_id: string;
  amount: string;
};

export type BurnTxsService = Service<
  string,
  string[],
  BurnTxsSearchRequest,
  Transaction
>;

export default ({
  drivers: { pg },
  emitEvent,
  timeouts,
}: CommonServiceDependencies): BurnTxsService => {
  return {
    get: getByIdPreset<string, BurnTxDbResponse, TransactionInfo, Transaction>({
      name: 'transactions.burn.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({
      pg: withStatementTimeout(pg, timeouts.get),
      emitEvent,
    }),

    mget: mgetByIdsPreset<
      string,
      BurnTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.burn.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema,
      transformResult: transformTxInfo,
    })({
      pg: withStatementTimeout(pg, timeouts.mget),
      emitEvent,
    }),

    search: searchWithPaginationPreset<
      Cursor,
      BurnTxsSearchRequest,
      BurnTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.burn.search',
      sql: sql.search,
      inputSchema: inputSearchSchema,
      resultSchema,
      transformResult: compose(transaction, transformTxInfo),
      cursorSerialization: {
        encode,
        decode,
      },
    })({
      pg: withStatementTimeout(pg, timeouts.search),
      emitEvent,
    }),
  };
};
