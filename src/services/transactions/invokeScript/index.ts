import { compose, identity } from 'ramda';

import { get, mget, search } from '../../_common/createResolver';

import { inputGet } from '../../presets/pg/getById/inputSchema';
import { inputMget } from '../../presets/pg/mgetByIds/inputSchema';

// validation
import { validateInput, validateResult } from '../../presets/validation';
import {
  result as resultSchema,
  inputSearch as inputSearchSchema,
} from './schema';
import { List, Serializable } from '../../../types';

import pgData from './pg';
import { PgDriver } from '../../../db/driver';

import { transformResults as transformResultGet } from '../../presets/pg/getById/transformResult';
import { transformResults as transformResultMget } from '../../presets/pg/mgetByIds/transformResult';
import { transformInput as transformInputSearch } from '../../presets/pg/searchWithPagination/transformInput';
import { transformResults as transformResultSearch } from '../../presets/pg/searchWithPagination/transformResult';
import transformTxInfo from './transformTxInfo';
import { EmitEvent } from './../../_common/createResolver/types';
import { RawInvokeScriptTx, InvokeScriptTx } from './types';
import { toSerializable } from '../../../types/serialization';

const createServiceName = (type: string) => `transactions.invokeScript.${type}`;

const transaction = (data?: InvokeScriptTx) =>
  toSerializable('transaction', data || null);

module.exports = ({
  drivers: { pg },
  emitEvent,
}: {
  drivers: { pg: PgDriver };
  emitEvent: EmitEvent;
}) => {
  return {
    get: get<
      string,
      string,
      RawInvokeScriptTx,
      Serializable<string, InvokeScriptTx | null>
    >({
      transformInput: identity,
      transformResult: transformResultGet<
        string,
        RawInvokeScriptTx,
        InvokeScriptTx,
        Serializable<'transaction', InvokeScriptTx | null>
      >(transaction)(transformTxInfo),
      validateInput: validateInput<string>(inputGet, createServiceName('get')),
      validateResult: validateResult<RawInvokeScriptTx>(
        resultSchema,
        createServiceName('get')
      ),
      dbQuery: pgData.get,
    })({ db: pg, emitEvent }),

    mget: mget<
      string[],
      string[],
      RawInvokeScriptTx,
      List<Serializable<string, InvokeScriptTx | null>>
    >({
      transformInput: identity,
      transformResult: transformResultMget<
        string[],
        RawInvokeScriptTx,
        InvokeScriptTx,
        Serializable<'transaction', InvokeScriptTx | null>
      >(transaction)(transformTxInfo),
      validateInput: validateInput<string[]>(
        inputMget,
        createServiceName('mget')
      ),
      validateResult: validateResult<RawInvokeScriptTx>(
        resultSchema,
        createServiceName('mget')
      ),
      dbQuery: pgData.mget,
    })({ db: pg, emitEvent }),

    search: search<
      any,
      any,
      RawInvokeScriptTx,
      List<Serializable<string, InvokeScriptTx | null>>
    >({
      transformInput: transformInputSearch,
      transformResult: transformResultSearch<
        any,
        RawInvokeScriptTx,
        Serializable<'transaction', InvokeScriptTx | null>
      >(
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
