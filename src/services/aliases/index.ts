import { getByIdPreset } from '../presets/pg/getById';
import { searchPreset } from '../presets/pg/search';
import { AliasInfo, ServiceGet, ServiceSearch, ServiceMget } from '../../types';

import { CommonServiceDependencies } from '..';
import { transformResults as transformSearch } from '../presets/pg/search/transformResult';
import * as sql from './data/sql';
import { AliasDbResponse, transformDbResponse } from './data/transformResult';
import { inputGet, inputMGet, inputSearch, output } from './schema';
import { mgetByIdsPreset } from '../../services/presets/pg/mgetByIds';
import { propEq } from 'ramda';

import { withStatementTimeout } from '../../db/driver';

export type AliasesGetRequest = string;
export type AliasesMgetRequest = string[];
export type AliasesSearchRequest = {
  address: string;
  showBroken: boolean;
};

export type AliasesService = ServiceGet<AliasesGetRequest, AliasInfo> &
  ServiceMget<AliasesMgetRequest, (AliasInfo | null)[]> &
  ServiceSearch<AliasesSearchRequest, AliasInfo[]>;

export default ({
  drivers,
  emitEvent,
  timeouts,
}: CommonServiceDependencies): AliasesService => {
  return {
    get: getByIdPreset<string, AliasDbResponse, AliasInfo>({
      name: 'aliases.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema: output,
      transformResult: transformDbResponse,
    })({
      pg: withStatementTimeout(drivers.pg, timeouts.get),
      emitEvent: emitEvent,
    }),

    mget: mgetByIdsPreset<string, AliasDbResponse, AliasInfo>({
      name: 'aliases.mget',
      sql: sql.mget,
      inputSchema: inputMGet,
      resultSchema: output,
      transformResult: transformDbResponse,
      matchRequestResult: propEq('alias'),
    })({
      pg: withStatementTimeout(drivers.pg, timeouts.mget),
      emitEvent: emitEvent,
    }),

    search: searchPreset<AliasesSearchRequest, AliasDbResponse, AliasInfo>({
      name: 'aliases.search',
      sql: sql.search,
      inputSchema: inputSearch,
      resultSchema: output,
      transformResult: transformSearch<
        AliasesSearchRequest,
        AliasDbResponse,
        AliasInfo
      >(transformDbResponse),
    })({
      pg: withStatementTimeout(drivers.pg, timeouts.search),
      emitEvent: emitEvent,
    }),
  };
};
