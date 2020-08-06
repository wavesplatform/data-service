import { propEq } from 'ramda';

import { TransactionInfo } from '../../../../types';
import { CommonRepoDependencies } from '../../..';
import { getByIdPreset } from '../../../_common/presets/pg/getById';
import { mgetByIdsPreset } from '../../../_common/presets/pg/mgetByIds';
import { searchPreset } from '../../../_common/presets/pg/search';

import { Cursor, serialize, deserialize } from '../../_common/cursor';

import { result as resultSchema } from './schema';
import * as sql from './sql';
import transformTxInfo from './transformTxInfo';
import { BurnTxsRepo, BurnTxDbResponse, BurnTxsSearchRequest } from './types';

export default ({
  drivers: { pg },
  emitEvent,
}: CommonRepoDependencies): BurnTxsRepo => {
  return {
    get: getByIdPreset({
      name: 'transactions.burn.get',
      sql: sql.get,
      resultSchema,
      transformResult: transformTxInfo,
    })({
      pg,
      emitEvent,
    }),

    mget: mgetByIdsPreset({
      name: 'transactions.burn.mget',
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
      BurnTxsSearchRequest,
      BurnTxDbResponse,
      TransactionInfo
    >({
      name: 'transactions.burn.search',
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
