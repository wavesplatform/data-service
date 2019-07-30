import { propEq } from 'ramda';

import {
  asset,
  Asset,
  AssetInfo,
  List,
  ServiceGet,
  ServiceMget,
  ServiceSearch,
} from '../../types';

import { CommonServiceCreatorDependencies } from '..';

// presets
import { getByIdPreset } from '../presets/pg/getById';
import { mgetByIdsPreset } from '../presets/pg/mgetByIds';
import { searchPreset } from '../presets/pg/search';

// validation
import { inputGet } from '../presets/pg/getById/inputSchema';
import { inputMget } from '../presets/pg/mgetByIds/inputSchema';
import {
  result as resultSchema,
  inputSearch as inputSearchSchema,
} from './schema';

import { AssetDbResponse, transformDbResponse } from './transformAsset';
import { transformResults as createTransformResult } from '../presets/pg/search/transformResult';
import * as sql from './sql';

type AssetsSearchRequest = {
  ticker: string;
  search: string;
  after: string;
  limit: number;
};

export type AssetsService = ServiceGet<string, Asset> &
  ServiceMget<string[], Asset> &
  ServiceSearch<AssetsSearchRequest, Asset>;

export default ({
  drivers: { pg },
  emitEvent,
}: CommonServiceCreatorDependencies): AssetsService => {
  return {
    get: getByIdPreset<string, AssetDbResponse, AssetInfo, Asset>({
      name: 'assets.get',
      sql: sql.get,
      inputSchema: inputGet,
      resultSchema,
      transformResult: transformDbResponse,
      resultTypeFactory: asset,
    })({ pg, emitEvent }),

    mget: mgetByIdsPreset<string, AssetDbResponse, AssetInfo, Asset>({
      name: 'assets.mget',
      matchRequestResult: propEq('asset_id'),
      sql: sql.mget,
      inputSchema: inputMget,
      resultSchema,
      transformResult: transformDbResponse,
      resultTypeFactory: asset,
    })({ pg, emitEvent }),

    search: searchPreset<
      AssetsSearchRequest,
      AssetDbResponse,
      AssetInfo,
      List<Asset>
    >({
      name: 'assets.search',
      sql: sql.search,
      inputSchema: inputSearchSchema,
      resultSchema,
      transformResult: createTransformResult<
        AssetsSearchRequest,
        AssetDbResponse,
        Asset
      >(asset)(transformDbResponse),
    })({ pg, emitEvent }),
  };
};
