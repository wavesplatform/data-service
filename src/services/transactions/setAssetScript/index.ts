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

import { result, inputSearch } from './schema';
import * as sql from './sql';
import * as transformTxInfo from './transformTxInfo';

type SetAssetScriptTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    assetId: string;
    script: string;
  }>;

type SetAssetScriptTxDbResponse = RawTx & {
  asset_id: string;
  script: string;
};

export type SetAssetScriptTxsService = Service<
  string,
  string[],
  SetAssetScriptTxsSearchRequest,
  Transaction
>;

export default ({
  drivers: { pg },
  emitEvent,
  timeouts,
}: CommonServiceDependencies): SetAssetScriptTxsService => {
  return {
    get: getByIdPreset<
      string,
      SetAssetScriptTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.setAssetScript.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema: result,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({
      pg: withStatementTimeout(pg, timeouts.get, timeouts.default),
      emitEvent,
    }),

    mget: mgetByIdsPreset<
      string,
      SetAssetScriptTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.setAssetScript.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({
      pg: withStatementTimeout(pg, timeouts.mget, timeouts.default),
      emitEvent,
    }),

    search: searchWithPaginationPreset<
      Cursor,
      SetAssetScriptTxsSearchRequest,
      SetAssetScriptTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.setAssetScript.search',
      sql: sql.search,
      inputSchema: inputSearch,
      resultSchema: result,
      transformResult: compose(transaction, transformTxInfo),
      cursor: {
        decode,
        encode,
      },
    })({
      pg: withStatementTimeout(pg, timeouts.search, timeouts.default),
      emitEvent,
    }),
  };
};
