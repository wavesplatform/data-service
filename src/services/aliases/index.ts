import { CommonServiceCreatorDependencies } from '..';
import { getByIdPreset } from '../presets/pg/getById';
import { searchPreset } from '../presets/pg/search';
import {
  alias,
  AliasInfo,
  Alias,
  ServiceGet,
  ServiceSearch,
  List,
} from '../../types';

import * as sql from './data/sql';
import { AliasDbResponse, transformDbResponse } from './data/transformResult';
import { transformResults as transformSearch } from '../presets/pg/search/transformResult';
import { inputGet, inputSearch, output } from './schema';

type AliasesSearchRequest = {
  address: string;
  showBroken: boolean;
};

export type AliasService = ServiceGet<string, Alias> &
  ServiceSearch<AliasesSearchRequest, Alias>;

export default ({
  drivers,
  emitEvent,
}: CommonServiceCreatorDependencies): AliasService => {
  return {
    get: getByIdPreset<string, AliasDbResponse, AliasInfo, Alias>({
      name: 'aliases.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema: output,
      transformResult: transformDbResponse,
      resultTypeFactory: alias,
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
