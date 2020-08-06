import { propEq } from 'ramda';

import { CommonRepoDependencies } from '../../..';
import { TransactionInfo } from '../../../../types';
import { getByIdPreset } from '../../../_common/presets/pg/getById';
import { mgetByIdsPreset } from '../../../_common/presets/pg/mgetByIds';
import { searchPreset } from '../../../_common/presets/pg/search';

import { Cursor, serialize, deserialize } from '../../_common/cursor';

import { result } from './schema';
import * as sql from './sql';
import * as transformTxInfo from './transformTxInfo';
import {
  SetAssetScriptTxsRepo,
  SetAssetScriptTxDbResponse,
  SetAssetScriptTxsSearchRequest,
} from './types';

export default ({
  drivers: { pg },
  emitEvent,
}: CommonRepoDependencies): SetAssetScriptTxsRepo => {
  return {
    get: getByIdPreset({
      name: 'transactions.setAssetScript.get',
      sql: sql.get,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({
      pg,
      emitEvent,
    }),

    mget: mgetByIdsPreset({
      name: 'transactions.setAssetScript.mget',
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
      SetAssetScriptTxsSearchRequest,
      SetAssetScriptTxDbResponse,
      TransactionInfo
    >({
      name: 'transactions.setAssetScript.search',
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
