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

import { Cursor, serialize, deserialize } from '../_common/cursor';
import { RawTx, CommonFilters } from '../_common/types';
import { transformTxInfo } from '../_common/transformTxInfo';

import {
  result as resultSchema,
  inputSearch as inputSearchSchema,
} from './schema';
import * as sql from './sql';

type AliasTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
>;

type AliasTxDbResponse = RawTx & {
  alias: string;
};

export type AliasTxsService = Service<
  string,
  string[],
  AliasTxsSearchRequest,
  Transaction
>;

export default ({
  drivers: { pg },
  emitEvent,
  timeouts,
}: CommonServiceDependencies): AliasTxsService => {
  return {
    get: getByIdPreset<string, AliasTxDbResponse, TransactionInfo, Transaction>(
      {
        name: 'transactions.alias.get',
        sql: sql.get,
        inputSchema: inputGet,
        resultSchema,
        resultTypeFactory: transaction,
        transformResult: transformTxInfo,
      }
    )({
      pg: withStatementTimeout(pg, timeouts.get),
      emitEvent,
    }),

    mget: mgetByIdsPreset<
      string,
      AliasTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.alias.mget',
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
      AliasTxsSearchRequest,
      AliasTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.alias.search',
      sql: sql.search,
      inputSchema: inputSearchSchema,
      resultSchema,
      transformResult: compose(transaction, transformTxInfo),
      cursorSerialization: {
        serialize,
        deserialize,
      },
    })({
      pg: withStatementTimeout(pg, timeouts.search),
      emitEvent,
    }),
  };
};
