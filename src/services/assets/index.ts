import { propEq, identity, zip } from 'ramda';
import { of as taskOf } from 'folktale/concurrency/task';
import { of as just, Maybe } from 'folktale/maybe';
import { tap } from '../../utils/tap';
import { forEach, isEmpty } from '../../utils/fp/maybeOps';

import { asset, Asset, AssetInfo, List } from '../../types';

import { CommonServiceDependencies } from '..';

// resolver creation and presets
import {
  get as createGetResolver,
  mget as createMgetResolver,
} from '../_common/createResolver';
import { getData as getByIdPg } from '../presets/pg/getById/pg';
import { getData as mgetByIdsPg } from '../presets/pg/mgetByIds/pg';
import { validateInput, validateResult } from '../presets/validation';
import { transformResults as transformMgetResults } from '../presets/pg/mgetByIds/transformResult';
import { searchPreset } from '../presets/pg/search';

// validation
import { inputGet } from '../presets/pg/getById/inputSchema';
import { inputMget } from '../presets/pg/mgetByIds/inputSchema';
import {
  result as resultSchema,
  inputSearch as inputSearchSchema,
} from './schema';

import { transformDbResponse } from './transformAsset';
import { transformResults as createTransformResult } from '../presets/pg/search/transformResult';
import * as sql from './sql';

import {
  AssetsCache,
  AssetDbResponse,
  AssetsService,
  AssetsSearchRequest,
} from './types';

export { create as createCache } from './cache';

export { AssetsService } from './types';

export default ({
  drivers: { pg },
  emitEvent,
  cache,
}: CommonServiceDependencies & { cache: AssetsCache }): AssetsService => {
  const SERVICE_NAME = {
    GET: 'assets.get',
    MGET: 'assets.mget',
    SEARCH: 'assets.search',
  };

  return {
    get: createGetResolver<string, string, AssetDbResponse, Asset>({
      transformInput: identity,
      validateInput: validateInput(inputGet, SERVICE_NAME.GET),
      getData: req =>
        cache.get(req).matchWith({
          Just: ({ value }) => taskOf(just(value)),
          Nothing: () =>
            getByIdPg<AssetDbResponse, string>({
              name: SERVICE_NAME.GET,
              sql: sql.get,
              pg,
            })(req).map(
              tap(maybeResp => forEach(x => cache.set(req, x), maybeResp))
            ),
        }),
      validateResult: validateResult(resultSchema, SERVICE_NAME.GET),
      transformResult: res => res.map(transformDbResponse).map(asset),
      emitEvent,
    }),

    mget: createMgetResolver<string[], string[], AssetDbResponse, List<Asset>>({
      transformInput: identity,
      validateInput: validateInput(inputMget, SERVICE_NAME.MGET),
      getData: request => {
        let results: Array<Maybe<AssetDbResponse>> = request.map(p =>
          cache.get(p)
        );

        const notCachedIndexes = results.filter(isEmpty).map((_, i) => i);

        return mgetByIdsPg<AssetDbResponse, string>({
          name: SERVICE_NAME.MGET,
          sql: sql.mget,
          matchRequestResult: propEq('asset_id'),
          pg,
        })(notCachedIndexes.map(i => request[i])).map(fromDb => {
          zip(fromDb, notCachedIndexes).forEach(
            ([res, i]) => (results[i] = res)
          );
          return results;
        });
      },
      validateResult: validateResult(resultSchema, SERVICE_NAME.MGET),
      transformResult: transformMgetResults<
        string[],
        AssetDbResponse,
        AssetInfo,
        Asset
      >(asset)(transformDbResponse),
      emitEvent,
    }),

    search: searchPreset<
      AssetsSearchRequest,
      AssetDbResponse,
      AssetInfo,
      List<Asset>
    >({
      name: SERVICE_NAME.SEARCH,
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
