import { compose, identity } from 'ramda';

import { CommonServiceCreatorDependencies } from '../../../middleware/injectServices';
import {
  transaction,
  TransactionInfo,
  Transaction,
  List,
  ServiceGet,
  ServiceMget,
  ServiceSearch,
} from '../../../types';
import { get, mget, search } from '../../_common/createResolver';
import { CommonFilters } from '../_common/types';
import { inputGet } from '../../presets/pg/getById/inputSchema';
import { inputMget } from '../../presets/pg/mgetByIds/inputSchema';
import { validateInput, validateResult } from '../../presets/validation';
import { transformResults as transformResultGet } from '../../presets/pg/getById/transformResult';
import { transformResults as transformResultMget } from '../../presets/pg/mgetByIds/transformResult';
import { transformInput as transformInputSearch } from '../../presets/pg/searchWithPagination/transformInput';
import { transformResults as transformResultSearch } from '../../presets/pg/searchWithPagination/transformResult';

import pgData from './pg';
import {
  result as resultSchema,
  inputSearch as inputSearchSchema,
} from './schema';
import * as transformTxInfo from './transformTxInfo';
import { RawInvokeScriptTx, InvokeScriptTx } from './types';

const createServiceName = (type: string) => `transactions.invokeScript.${type}`;

type InvokeScriptTxsSearchRequest = CommonFilters;

export type InvokeScriptTxsService = ServiceGet<string, Transaction> &
  ServiceMget<string[], Transaction> &
  ServiceSearch<InvokeScriptTxsSearchRequest, Transaction>;

export default ({
  drivers: { pg },
  emitEvent,
}: CommonServiceCreatorDependencies): InvokeScriptTxsService => {
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
      dbQuery: pgData.get,
    })({ db: pg, emitEvent }),

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
      dbQuery: pgData.mget,
    })({ db: pg, emitEvent }),

    search: search<any, any, RawInvokeScriptTx, List<Transaction>>({
      transformInput: transformInputSearch,
      transformResult: transformResultSearch(
        compose(
          transaction,
          transformTxInfo
        )
      ),
      validateInput: validateInput<any>(
        inputSearchSchema,
        createServiceName('search')
      ),
      validateResult: validateResult<RawInvokeScriptTx>(
        resultSchema,
        createServiceName('search')
      ),
      dbQuery: pgData.search,
    })({ db: pg, emitEvent }),
  };
};
