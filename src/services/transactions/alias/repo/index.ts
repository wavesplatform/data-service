import { propEq } from 'ramda';

import { withStatementTimeout } from '../../../../db/driver';
import { CommonRepoDependencies } from '../../..';
import { TransactionInfo } from '../../../../types';
import { getByIdPreset } from '../../../_common/presets/pg/getById';
import { mgetByIdsPreset } from '../../../_common/presets/pg/mgetByIds';
import { searchPreset } from '../../../_common/presets/pg/search';

import { Cursor, serialize, deserialize } from '../../_common/cursor';
import { transformTxInfo } from '../../_common/transformTxInfo';

import { result as resultSchema } from './schema';
import * as sql from './sql';
import {
  AliasTxsRepo,
  AliasTxsSearchRequest,
  AliasTxDbResponse,
} from './types';

export default ({
  drivers: { pg },
  emitEvent,
  timeouts,
}: CommonRepoDependencies): AliasTxsRepo => {
  return {
    get: getByIdPreset({
      name: 'transactions.alias.get',
      sql: sql.get,
      resultSchema,
      transformResult: transformTxInfo,
    })({
      pg: withStatementTimeout(pg, timeouts.get),
      emitEvent,
    }),

    mget: mgetByIdsPreset({
      name: 'transactions.alias.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      resultSchema,
      transformResult: transformTxInfo,
    })({
      pg: withStatementTimeout(pg, timeouts.mget),
      emitEvent,
    }),

    search: searchPreset<
      Cursor,
      AliasTxsSearchRequest,
      AliasTxDbResponse,
      TransactionInfo
    >({
      name: 'transactions.alias.search',
      sql: sql.search,
      resultSchema,
      transformResult: transformTxInfo,
      cursorSerialization: {
        serialize,
        deserialize,
      },
    })({
      pg: withStatementTimeout(pg, timeouts.search),
      emitEvent,
    }),
  };
};
