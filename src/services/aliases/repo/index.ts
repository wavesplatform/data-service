import { propEq } from 'ramda';

import { withStatementTimeout } from '../../../db/driver';
import { AliasInfo, Repo } from '../../../types';

import { CommonRepoDependencies } from '../..';
import { getByIdPreset } from '../../_common/presets/pg/getById';
import { mgetByIdsPreset } from '../../_common/presets/pg/mgetByIds';
import { searchPreset } from '../../_common/presets/pg/search';
import { WithLimit } from '../../_common';

import { serialize, deserialize } from './cursor';
import sql from './data/sql';
import { transformDbResponse } from './data/transformResult';
import { output } from './schema';

export type AliasesGetRequest = string;
export type AliasesMgetRequest = string[];
export type AliasesSearchRequest = WithLimit & {
  address: string;
  showBroken: boolean;
};

export type AliasesRepo = Repo<
  AliasesGetRequest,
  AliasesMgetRequest,
  AliasesSearchRequest,
  AliasInfo
>;

export default ({
  drivers,
  emitEvent,
  timeouts,
}: CommonRepoDependencies): AliasesRepo => {
  return {
    get: getByIdPreset({
      name: 'aliases.get',
      sql: sql.get,
      resultSchema: output,
      transformResult: transformDbResponse,
    })({
      pg: withStatementTimeout(drivers.pg, timeouts.get),
      emitEvent: emitEvent,
    }),

    mget: mgetByIdsPreset({
      name: 'aliases.mget',
      sql: sql.mget,
      resultSchema: output,
      transformResult: transformDbResponse,
      matchRequestResult: propEq('alias'),
    })({
      pg: withStatementTimeout(drivers.pg, timeouts.mget),
      emitEvent: emitEvent,
    }),

    search: searchPreset({
      name: 'aliases.search',
      sql: sql.search,
      resultSchema: output,
      transformResult: transformDbResponse,
      cursorSerialization: {
        serialize,
        deserialize,
      },
    })({
      pg: withStatementTimeout(drivers.pg, timeouts.search),
      emitEvent: emitEvent,
    }),
  };
};
