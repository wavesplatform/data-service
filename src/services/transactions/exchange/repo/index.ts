import { propEq } from 'ramda';

import { TransactionInfo } from '../../../../types';
import { CommonRepoDependencies } from '../../..';
import { getByIdPreset } from '../../../_common/presets/pg/getById';
import { mgetByIdsPreset } from '../../../_common/presets/pg/mgetByIds';
import { searchPreset } from '../../../_common/presets/pg/search';

import { Cursor, serialize, deserialize } from '../../_common/cursor';

import { result } from './schema';
import * as sql from './sql';
import transformTxInfo from './transformTxInfo';
import {
  ExchangeTxsRepo,
  ExchangeTxsSearchRequest,
  ExchangeTxDbResponse,
} from './types';

export default ({
  drivers: { pg },
  emitEvent,
}: CommonRepoDependencies): ExchangeTxsRepo => {
  return {
    get: getByIdPreset({
      name: 'transactions.exchange.get',
      sql: sql.get,
      resultSchema: result,
      transformResult: transformTxInfo,
    })({
      pg,
      emitEvent,
    }),

    mget: mgetByIdsPreset({
      name: 'transactions.exchange.mget',
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
      ExchangeTxsSearchRequest,
      ExchangeTxDbResponse,
      TransactionInfo
    >({
      name: 'transactions.exchange.search',
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
