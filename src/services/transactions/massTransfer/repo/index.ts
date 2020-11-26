import { propEq } from 'ramda';

import { CommonRepoDependencies } from '../../..';
import { getByIdPreset } from '../../../_common/presets/pg/getById';
import { mgetByIdsPreset } from '../../../_common/presets/pg/mgetByIds';
import { searchPreset } from '../../../_common/presets/pg/search';

import { Cursor, serialize, deserialize } from '../../_common/cursor';

import { result } from './schema';
import * as sql from './sql';
import * as transformTxInfo from './transformTxInfo';
import {
  MassTransferTxsRepo,
  MassTransferTxsSearchRequest,
  MassTransferTxDbResponse,
  MassTransferTx,
} from './types';

export default ({
  drivers: { pg },
  emitEvent,
}: CommonRepoDependencies): MassTransferTxsRepo => {
  return {
    get: getByIdPreset({
      name: 'transactions.massTransfer.get',
      sql: sql.get,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({
      pg,
      emitEvent,
    }),

    mget: mgetByIdsPreset({
      name: 'transactions.massTransfer.mget',
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
      MassTransferTxsSearchRequest,
      MassTransferTxDbResponse,
      MassTransferTx
    >({
      name: 'transactions.massTransfer.search',
      sql: sql.search,
      resultSchema: result,
      transformResult: transformTxInfo,
      cursorSerialization: { serialize, deserialize },
    })({
      pg,
      emitEvent,
    }),
  };
};
