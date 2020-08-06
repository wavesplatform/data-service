import { propEq } from 'ramda';

import { CommonRepoDependencies } from '../../..';
import { TransactionInfo } from '../../../../types';
import { getByIdPreset } from '../../../_common/presets/pg/getById';
import { mgetByIdsPreset } from '../../../_common/presets/pg/mgetByIds';
import { searchPreset } from '../../../_common/presets/pg/search';

import { Cursor, serialize, deserialize } from '../../_common/cursor';
import { transformTxInfo } from '../../_common/transformTxInfo';

import { result } from './schema';
import * as sql from './sql';
import {
  SetScriptTxsRepo,
  SetScriptTxDbResponse,
  SetScriptTxsSearchRequest,
} from './types';

export default ({
  drivers: { pg },
  emitEvent,
}: CommonRepoDependencies): SetScriptTxsRepo => {
  return {
    get: getByIdPreset({
      name: 'transactions.setScript.get',
      sql: sql.get,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({
      pg,
      emitEvent,
    }),

    mget: mgetByIdsPreset({
      name: 'transactions.setScript.mget',
      matchRequestResult: propEq('id'),
      sql: sql.mget,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({
      pg,
      emitEvent,
    }),

    search: searchPreset<
      Cursor,
      SetScriptTxsSearchRequest,
      SetScriptTxDbResponse,
      TransactionInfo
    >({
      name: 'transactions.setScript.search',
      sql: sql.search,
      resultSchema: result,
      transformResult: transformTxInfo,
      cursorSerialization: {
        serialize,
        deserialize,
      },
    })({
      pg,
      emitEvent,
    }),
  };
};
