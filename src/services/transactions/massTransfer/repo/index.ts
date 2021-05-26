import { Ok as ok } from 'folktale/result';

import { CommonRepoDependencies } from '../../..';
import { get, mget, search } from '../../../_common/createResolver';
import { validateResult } from '../../../_common/presets/validation';
import { transformResults as transformResultGet } from '../../../_common/presets/pg/getById/transformResult';
import { transformResults as transformResultMget } from '../../../_common/presets/pg/mgetByIds/transformResult';
import { transformInput as transformInputSearch } from '../../../_common/presets/pg/search/transformInput';
import { transformResults as transformResultSearch } from '../../../_common/presets/pg/search/transformResults';

import { Cursor, serialize, deserialize } from '../../_common/cursor';

import pgData from './pg';
import { result as resultSchema } from './schema';
import * as transformTxInfo from './transformTxInfo';
import {
  MassTransferTxsRepo,
  MassTransferTxsSearchRequest,
  RawMassTransferTx,
  MassTransferTx,
} from './types';

const createServiceName = (type: string) => `transactions.massTransfer.${type}`;

export default ({
  drivers: { pg },
  emitEvent,
}: CommonRepoDependencies): MassTransferTxsRepo => {
  return {
    get: get({
      transformInput: ok,
      transformResult: transformResultGet(transformTxInfo),
      validateResult: validateResult<RawMassTransferTx>(
        resultSchema,
        createServiceName('get')
      ),
      getData: pgData.get(pg),
      emitEvent,
    }),

    mget: mget({
      transformInput: ok,
      transformResult: transformResultMget(transformTxInfo),
      validateResult: validateResult(resultSchema, createServiceName('mget')),
      getData: pgData.mget(pg),
      emitEvent,
    }),

    search: search<
      MassTransferTxsSearchRequest,
      MassTransferTxsSearchRequest<Cursor>,
      RawMassTransferTx,
      MassTransferTx
    >({
      transformInput: transformInputSearch(deserialize),
      transformResult: transformResultSearch<Cursor, MassTransferTxsSearchRequest<string>, RawMassTransferTx,
        MassTransferTx>(transformTxInfo, serialize),
      validateResult: validateResult<RawMassTransferTx>(
        resultSchema,
        createServiceName('search')
      ),
      getData: pgData.search(pg),
      emitEvent,
    }),
  };
};
