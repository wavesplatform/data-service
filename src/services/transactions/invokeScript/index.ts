import { compose, identity } from 'ramda';

import { withStatementTimeout } from '../../../db/driver';
import { CommonServiceDependencies } from '../..';
import {
  transaction,
  TransactionInfo,
  Transaction,
  List,
  Service,
} from '../../../types';
import { WithSortOrder, WithLimit } from '../../_common';
import { get, mget, search } from '../../_common/createResolver';
import { CommonFilters } from '../_common/types';
import { inputGet } from '../../presets/pg/getById/inputSchema';
import { inputMget } from '../../presets/pg/mgetByIds/inputSchema';
import { validateInput, validateResult } from '../../presets/validation';
import { transformResults as transformResultGet } from '../../presets/pg/getById/transformResult';
import { transformResults as transformResultMget } from '../../presets/pg/mgetByIds/transformResult';
import { transformInput as transformInputSearch } from '../../presets/pg/searchWithPagination/transformInput';
import { transformResults as transformResultSearch } from '../../presets/pg/searchWithPagination/transformResult';

import { decode, encode, Cursor } from '../_common/cursor';

import pgData from './pg';
import {
  result as resultSchema,
  inputSearch as inputSearchSchema,
} from './schema';
import * as transformTxInfo from './transformTxInfo';
import { RawInvokeScriptTx, InvokeScriptTx } from './types';
import { RequestWithCursor } from '../../_common/pagination';

const createServiceName = (type: string) => `transactions.invokeScript.${type}`;

export type InvokeScriptTxsSearchRequest = RequestWithCursor<
  CommonFilters &
    WithSortOrder &
    WithLimit &
    Partial<{
      dapp: string;
      function: string;
    }>,
  Cursor
>;

export type InvokeScriptTxsService = Service<
  string,
  string[],
  InvokeScriptTxsSearchRequest,
  Transaction
>;

export default ({
  drivers: { pg },
  emitEvent,
  timeouts,
}: CommonServiceDependencies): InvokeScriptTxsService => {
  return {
    get: get<string, string, RawInvokeScriptTx, Transaction>({
      transformInput: identity,
      transformResult: transformResultGet<
        string,
        RawInvokeScriptTx,
        InvokeScriptTx,
        Transaction
      >(transaction)(transformTxInfo),
      validateInput: validateInput<string>(inputGet, createServiceName('get')),
      validateResult: validateResult<RawInvokeScriptTx>(
        resultSchema,
        createServiceName('get')
      ),
      getData: pgData.get(withStatementTimeout(pg, timeouts.get)),
      emitEvent,
    }),

    mget: mget<string[], string[], RawInvokeScriptTx, List<Transaction>>({
      transformInput: identity,
      transformResult: transformResultMget<
        string[],
        RawInvokeScriptTx,
        TransactionInfo,
        Transaction
      >(transaction)(transformTxInfo),
      validateInput: validateInput(inputMget, createServiceName('mget')),
      validateResult: validateResult(resultSchema, createServiceName('mget')),
      getData: pgData.mget(withStatementTimeout(pg, timeouts.mget)),
      emitEvent,
    }),

    search: search<
      InvokeScriptTxsSearchRequest,
      InvokeScriptTxsSearchRequest,
      RawInvokeScriptTx,
      List<Transaction>
    >({
      transformInput: transformInputSearch(decode),
      transformResult: transformResultSearch(
        compose(transaction, transformTxInfo),
        encode
      ),
      validateInput: validateInput<InvokeScriptTxsSearchRequest>(
        inputSearchSchema,
        createServiceName('search')
      ),
      validateResult: validateResult<RawInvokeScriptTx>(
        resultSchema,
        createServiceName('search')
      ),
      getData: pgData.search(withStatementTimeout(pg, timeouts.search)),
      emitEvent,
    }),
  };
};
