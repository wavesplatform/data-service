import { propEq, compose, Omit } from 'ramda';
import { BigNumber } from '@waves/data-entities';

import { CommonServiceCreatorDependencies } from '../..';
import {
  transaction,
  TransactionInfo,
  Transaction,
  ServiceGet,
  ServiceMget,
  ServiceSearch,
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

import {
  result as resultSchema,
  inputSearch as inputSearchSchema,
} from './schema';
import * as sql from './sql';

type GenesisTxsSearchRequest = RequestWithCursor<
  Omit<CommonFilters, 'sender'> & WithSortOrder & WithLimit,
  string
>;

type GenesisTxDbResponse = Omit<RawTx, 'sender'> & {
  amount: BigNumber;
  recipient: string;
};

export type GenesisTxsService = ServiceGet<string, Transaction> &
  ServiceMget<string[], Transaction> &
  ServiceSearch<GenesisTxsSearchRequest, Transaction>;

export default ({
  drivers: { pg },
  emitEvent,
}: CommonServiceCreatorDependencies): GenesisTxsService => {
  return {
    get: getByIdPreset<
      string,
      GenesisTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.genesis.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema,
      resultTypeFactory: transaction,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset<
      string,
      GenesisTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.genesis.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultTypeFactory: transaction,
      resultSchema,
      transformResult: transformTxInfo,
    })({ pg, emitEvent }),

    search: searchWithPaginationPreset<
      GenesisTxsSearchRequest,
      GenesisTxDbResponse,
      TransactionInfo,
      Transaction
    >({
      name: 'transactions.genesis.search',
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
