import { Ok as ok } from 'folktale/result';

import { withStatementTimeout } from '../../../../db/driver';
import { CommonRepoDependencies } from '../../..';
import { TransactionInfo } from '../../../../types';

import { get, mget, search } from '../../../_common/createResolver';

// validation
import { validateResult } from '../../../_common/presets/validation';

// transformation
import { transformResults as transformResultGet } from '../../../_common/presets/pg/getById/transformResult';
import { transformResults as transformResultMget } from '../../../_common/presets/pg/mgetByIds/transformResult';
import { transformInput as transformInputSearch } from '../../../_common/presets/pg/search/transformInput';
import { transformResults as transformResultSearch } from '../../../_common/presets/pg/search/transformResults';

import { serialize, deserialize, Cursor } from '../../_common/cursor';
import { result as resultSchema } from './schema';
import { pg as pgData } from './pg';
import * as transformTxInfo from './transformTxInfo';
import { DataTxsSearchRequest, DataTxDbResponse, DataTxsRepo } from './types';

const createServiceName = (type: string): string => `transactions.data.${type}`;

export default ({
  drivers: { pg },
  emitEvent,
  timeouts,
}: CommonRepoDependencies): DataTxsRepo => {
  return {
    get: get({
      transformInput: ok,
      transformResult: transformResultGet<
        string,
        DataTxDbResponse,
        TransactionInfo
      >(transformTxInfo),
      validateResult: validateResult(resultSchema, createServiceName('get')),
      getData: pgData.get(withStatementTimeout(pg, timeouts.get)),
      emitEvent,
    }),

    mget: mget({
      transformInput: ok,
      transformResult: transformResultMget<
        string[],
        DataTxDbResponse,
        TransactionInfo
      >(transformTxInfo),
      validateResult: validateResult(resultSchema, createServiceName('mget')),
      getData: pgData.mget(withStatementTimeout(pg, timeouts.mget)),
      emitEvent,
    }),

    search: search<
      DataTxsSearchRequest,
      DataTxsSearchRequest<Cursor>,
      DataTxDbResponse,
      TransactionInfo
    >({
      transformInput: transformInputSearch(deserialize),
      transformResult: transformResultSearch(transformTxInfo, serialize),
      validateResult: validateResult(resultSchema, createServiceName('search')),
      getData: pgData.search(withStatementTimeout(pg, timeouts.search)),
      emitEvent,
    }),
  };
};
