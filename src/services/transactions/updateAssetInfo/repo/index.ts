import { propEq } from 'ramda';

import { CommonRepoDependencies } from '../../..';
import { getByIdPreset } from '../../../_common/presets/pg/getById';
import { mgetByIdsPreset } from '../../../_common/presets/pg/mgetByIds';
import { searchPreset } from '../../../_common/presets/pg/search';

import { Cursor, serialize, deserialize } from '../../_common/cursor';
import { transformTxInfo } from '../../_common/transformTxInfo';

import { result as resultSchema } from './schema';
import * as sql from './sql';
import {
  UpdateAssetInfoTxsRepo,
  UpdateAssetInfoTxsSearchRequest,
  UpdateAssetInfoTxDbResponse,
  UpdateAssetInfoTx,
} from './types';

export default ({
  drivers: { pg },
  emitEvent,
}: CommonRepoDependencies): UpdateAssetInfoTxsRepo => {
  return {
    get: getByIdPreset({
      name: 'transactions.updateAssetInfo.get',
      sql: sql.get,
      resultSchema,
      transformResult: transformTxInfo,
    })({
      pg,
      emitEvent,
    }),

    mget: mgetByIdsPreset({
      name: 'transactions.updateAssetInfo.mget',
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
      UpdateAssetInfoTxsSearchRequest,
      UpdateAssetInfoTxDbResponse,
      UpdateAssetInfoTx
    >({
      name: 'transactions.updateAssetInfo.search',
      sql: sql.search,
      resultSchema,
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
