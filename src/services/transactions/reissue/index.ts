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
import { inputGet } from '../../presets/pg/getById/inputSchema';
import { inputMget } from '../../presets/pg/mgetByIds/inputSchema';
import { searchWithPaginationPreset } from '../../presets/pg/searchWithPagination';

import { RawTx, CommonFilters } from '../_common/types';

import {
  result as resultSchema,
  inputSearch as inputSearchSchema,
} from './schema';
import * as sql from './sql';
import * as transformTxInfo from './transformTxInfo';

type ReissueTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> & {
  assetId: string;
};

type ReissueTxDbResponse = RawTx & {
  asset_id: string;
  quantity: string;
  reissuable: string;
};

export type ReissueTxsService = ServiceGet<string, Transaction> &
  ServiceMget<string[], Transaction> &
  ServiceSearch<ReissueTxsSearchRequest, Transaction>;

export default ({
  drivers: { pg },
  emitEvent,
}: CommonServiceCreatorDependencies): ReissueTxsService => {
  return {
    get: getByIdPreset<
      string,
      ReissueTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.reissue.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset<
      string,
      ReissueTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.reissue.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    search: searchWithPaginationPreset<
      ReissueTxsSearchRequest,
      ReissueTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.reissue.search',
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
