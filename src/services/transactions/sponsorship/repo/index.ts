import { propEq } from 'ramda';

import { CommonRepoDependencies } from '../../..';
import { getByIdPreset } from '../../../_common/presets/pg/getById';
import { mgetByIdsPreset } from '../../../_common/presets/pg/mgetByIds';
import { searchPreset } from '../../../_common/presets/pg/search';

import { Cursor, serialize, deserialize } from '../../_common/cursor';

import { result as resultSchema } from './schema';
import * as sql from './sql';
import * as transformTxInfo from './transformTxInfo';
import {
  SponsorshipTxsRepo,
  SponsorshipTxsSearchRequest,
  SponsorshipTxDbResponse,
  SponsorshipTx,
} from './types';

export default ({
  drivers: { pg },
  emitEvent,
}: CommonRepoDependencies): SponsorshipTxsRepo => {
  return {
    get: getByIdPreset({
      name: 'transactions.sponsorship.get',
      sql: sql.get,
      resultSchema,
      transformResult: transformTxInfo,
    })({
      pg,
      emitEvent,
    }),

    mget: mgetByIdsPreset({
      name: 'transactions.sponsorship.mget',
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
      SponsorshipTxsSearchRequest,
      SponsorshipTxDbResponse,
      SponsorshipTx
    >({
      name: 'transactions.sponsorship.search',
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
