import { propEq } from 'ramda';

import { CommonTransactionInfo } from '../../../../types';
import { CommonRepoDependencies } from '../../..';
import { getByIdPreset } from '../../../_common/presets/pg/getById';
import { mgetByIdsPreset } from '../../../_common/presets/pg/mgetByIds';
import { searchPreset } from '../../../_common/presets/pg/search';

import { serialize, deserialize, Cursor } from '../../_common/cursor';
import { result } from './schema';
import sql from './sql';
import { transformTxInfo } from './transformTxInfo';
import {
  AllTxsRepo,
  AllTxsGetRequest,
  AllTxsSearchRequest,
  TxDbResponse,
} from './types';

export default ({
  drivers: { pg },
  emitEvent,
}: CommonRepoDependencies): AllTxsRepo => {
  return {
    get: getByIdPreset<AllTxsGetRequest, TxDbResponse, CommonTransactionInfo>({
      name: 'transactions.all.commonData.get',
      sql: sql.get,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({
      pg,
      emitEvent,
    }),

    mget: mgetByIdsPreset<string, TxDbResponse, CommonTransactionInfo>({
      name: 'transactions.all.commonData.mget',
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
      AllTxsSearchRequest,
      TxDbResponse,
      CommonTransactionInfo
    >({
      name: 'transactions.all.commonData.search',
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
