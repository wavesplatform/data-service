import { propEq, compose } from 'ramda';
import { BigNumber } from '@waves/data-entities';

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

import { RawTx, CommonFilters } from '../_common/types';

import { result, inputSearch } from './schema';
import * as sql from './sql';
import * as transformTxInfo from './transformTxInfo';

type MassTransferTxsSearchRequest = RequestWithCursor<
  CommonFilters & WithSortOrder & WithLimit,
  string
> &
  Partial<{
    sender: string;
    assetId: string;
    recipient: string;
  }>;

type MassTransferTxDbResponse = RawTx & {
  asset_id: string;
  attachment: string;
  sender: string;
  sender_public_key: string;
  recipients: string;
  amounts: BigNumber[];
};

export type MassTransferTxsService = Service<
  string,
  string[],
  MassTransferTxsSearchRequest,
  Transaction
>;

export default ({
  drivers: { pg },
  emitEvent,
}: CommonServiceDependencies): MassTransferTxsService => {
  return {
    get: getByIdPreset<
      string,
      MassTransferTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.massTransfer.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema: result,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset<
      string,
      MassTransferTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.massTransfer.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    search: searchWithPaginationPreset<
      MassTransferTxsSearchRequest,
      MassTransferTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.massTransfer.search',
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
