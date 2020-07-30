import { propEq, compose } from 'ramda';

import { CommonServiceDependencies } from '../..';
import { transaction, TransactionInfo, Transaction, Service } from '../../../types';
import { WithLimit, WithSortOrder } from '../../_common';
import { RequestWithCursor } from '../../_common/pagination';
import { getByIdPreset } from '../../presets/pg/getById';
import { mgetByIdsPreset } from '../../presets/pg/mgetByIds';
import { searchWithPaginationPreset } from '../../presets/pg/searchWithPagination';
import { inputGet } from '../../presets/pg/getById/inputSchema';
import { inputMget } from '../../presets/pg/mgetByIds/inputSchema';

import { Cursor, serialize, deserialize } from '../_common/cursor';
import { RawTx, CommonFilters } from '../_common/types';

import { result as resultSchema, inputSearch as inputSearchSchema } from './schema';
import * as sql from './sql';
import transformTxInfo from './transformTxInfo';

type UpdateAssetInfoTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    assetId: string;
  }>;

type UpdateAssetInfoTxDbResponse = RawTx & {
  asset_id: string;
  asset_name: string;
  description: string;
};

export type UpdateAssetInfoTxsService = Service<
  string,
  string[],
  UpdateAssetInfoTxsSearchRequest,
  Transaction
>;

export default ({
  drivers: { pg },
  emitEvent,
}: CommonServiceDependencies): UpdateAssetInfoTxsService => {
  return {
    get: getByIdPreset<string, UpdateAssetInfoTxDbResponse, TransactionInfo, Transaction>({
      name: 'transactions.updateAssetInfo.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({
      pg,
      emitEvent,
    }),

    mget: mgetByIdsPreset<string, UpdateAssetInfoTxDbResponse, TransactionInfo, Transaction>({
      name: 'transactions.updateAssetInfo.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema,
      transformResult: transformTxInfo,
    })({
      pg,
      emitEvent,
    }),

    search: searchWithPaginationPreset<
      Cursor,
      UpdateAssetInfoTxsSearchRequest,
      UpdateAssetInfoTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.updateAssetInfo.search',
      sql: sql.search,
      inputSchema: inputSearchSchema,
      resultSchema,
      transformResult: compose(transaction, transformTxInfo),
      cursorSerialization: { serialize, deserialize },
    })({
      pg,
      emitEvent,
    }),
  };
};
