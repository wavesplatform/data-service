import { getByIdPreset } from '../presets/pg/getById';
import { searchPreset } from '../presets/pg/search';
import {
  alias,
  AliasInfo,
  Alias,
  ServiceGet,
  ServiceSearch,
  List,
  ServiceMget,
} from '../../types';

import { CommonServiceDependencies } from '..';
import { transformResults as transformSearch } from '../presets/pg/search/transformResult';
import * as sql from './data/sql';
import { AliasDbResponse, transformDbResponse } from './data/transformResult';
import { inputGet, inputMGet, inputSearch, output } from './schema';
import { mgetByIdsPreset } from '../../services/presets/pg/mgetByIds';
import { propEq } from 'ramda';

type AliasesSearchRequest = {
  address: string;
  showBroken: boolean;
};

type AliasMGetParams = string[]

export type AliasService = ServiceGet<string, Alias> &
  ServiceSearch<AliasesSearchRequest, Alias> &
  ServiceMget<AliasMGetParams, Alias>

export default ({
  drivers,
  emitEvent,
}: CommonServiceDependencies): AliasService => {
  return {
    get: getByIdPreset<string, AliasDbResponse, AliasInfo, Alias>({
      name: 'aliases.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema: output,
      transformResult: transformDbResponse,
      resultTypeFactory: alias,
    })({ pg: drivers.pg, emitEvent: emitEvent }),

    mget: mgetByIdsPreset<string, AliasDbResponse, AliasInfo, Alias>({
      name: 'aliases.mget',
      sql: sql.mget,
      inputSchema: inputMGet,
      resultSchema: output,
      transformResult: transformDbResponse,
      resultTypeFactory: alias,
      matchRequestResult: propEq('alias')
    })({ pg: drivers.pg, emitEvent: emitEvent }),

    search: searchPreset<
      AliasesSearchRequest,
      AliasDbResponse,
      AliasInfo,
      List<Alias>
    >({
      name: 'aliases.search',
      sql: sql.search,
      inputSchema: inputSearch,
      resultSchema: output,
      transformResult: transformSearch<
        AliasesSearchRequest,
        AliasDbResponse,
        Alias
      >(alias)(transformDbResponse),
    })({ pg: drivers.pg, emitEvent: emitEvent }),
  };
};
