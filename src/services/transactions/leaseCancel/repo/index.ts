import { propEq } from 'ramda';

import { CommonRepoDependencies } from '../../..';
import { TransactionInfo } from '../../../../types';
import { getByIdPreset } from '../../../_common/presets/pg/getById';
import { mgetByIdsPreset } from '../../../_common/presets/pg/mgetByIds';
import { searchPreset } from '../../../_common/presets/pg/search';

import { Cursor, serialize, deserialize } from '../../_common/cursor';

import { result as resultSchema } from './schema';
import * as sql from './sql';
import * as transformTxInfo from './transformTxInfo';
import {
  LeaseCancelTxsRepo,
  LeaseCancelTxsSearchRequest,
  LeaseCancelTxDbResponse,
} from './types';

export default ({
  drivers: { pg },
  emitEvent,
}: CommonRepoDependencies): LeaseCancelTxsRepo => {
  return {
    get: getByIdPreset({
      name: 'transactions.leaseCancel.get',
      sql: sql.get,
      resultSchema,
      transformResult: transformTxInfo,
    })({
      pg,
      emitEvent,
    }),

    mget: mgetByIdsPreset({
      name: 'transactions.leaseCancel.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      resultSchema,
      transformResult: transformTxInfo,
    })({
      pg,
      emitEvent,
    }),

    search: searchPreset<
      Cursor,
      LeaseCancelTxsSearchRequest,
      LeaseCancelTxDbResponse,
      TransactionInfo
    >({
      name: 'transactions.leaseCancel.search',
      sql: sql.search,
      resultSchema,
      transformResult: transformTxInfo,
      cursorSerialization: { serialize, deserialize },
    })({
      pg,
      emitEvent,
    }),
  };
};
