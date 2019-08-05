import { propEq, compose } from 'ramda';

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
import { inputGet } from '../../presets/pg/getById/inputSchema';
import { inputMget } from '../../presets/pg/mgetByIds/inputSchema';
import { searchWithPaginationPreset } from '../../presets/pg/searchWithPagination';

import { transformTxInfo } from '../_common/transformTxInfo';
import { RawTx, CommonFilters } from '../_common/types';

import { result, inputSearch } from './schema';
import * as sql from './sql';

type SetScriptTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    sender: string;
    script: string;
  }>;

type SetScriptTxDbResponse = RawTx & {
  script: string;
};

export type SetScriptTxsService = Service<
  string,
  string[],
  SetScriptTxsSearchRequest,
  Transaction
>;

export default ({
  drivers: { pg },
  emitEvent,
}: CommonServiceDependencies): SetScriptTxsService => {
  return {
    get: getByIdPreset<
      string,
      SetScriptTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.setScript.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema: result,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset<
      string,
      SetScriptTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.setScript.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    search: searchWithPaginationPreset<
      SetScriptTxsSearchRequest,
      SetScriptTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.setScript.search',
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
