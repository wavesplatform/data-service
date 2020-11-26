import { propEq } from 'ramda';
import { of as taskOf } from 'folktale/concurrency/task';
import { of as just, Maybe } from 'folktale/maybe';
import { Ok as ok } from 'folktale/result';
import { Asset } from '@waves/data-entities';

import { tap } from '../../../utils/tap';
import { forEach, isEmpty } from '../../../utils/fp/maybeOps';
import { AssetInfo } from '../../../types';

import { CommonRepoDependencies } from '../..';

// resolver creation and presets
import {
  get as createGetResolver,
  mget as createMgetResolver,
} from '../../_common/createResolver';
import { getData as getByIdPg } from '../../_common/presets/pg/getById/pg';
import { getData as mgetByIdsPg } from '../../_common/presets/pg/mgetByIds/pg';
import { validateResult } from '../../_common/presets/validation';
import { transformResults as transformMgetResults } from '../../_common/presets/pg/mgetByIds/transformResult';
import { searchPreset } from '../../_common/presets/pg/search';

// validation
import { result as resultSchema } from './schema';

import { transformDbResponse } from './transformAsset';
import * as sql from './sql';
import {
  AssetsCache,
  AssetDbResponse,
  AssetsRepo,
  AssetsGetRequest,
  AssetsMgetRequest,
  AssetsSearchRequest,
} from './types';
import { serialize, deserialize, Cursor } from './cursor';
export { create as createCache } from './cache';

export default ({
  drivers: { pg },
  emitEvent,
  cache,
}: CommonRepoDependencies & {
  cache: AssetsCache;
}): AssetsRepo => {
  const SERVICE_NAME = {
    GET: 'assets.get',
    MGET: 'assets.mget',
    SEARCH: 'assets.search',
  };

  return {
    get: createGetResolver<
      AssetsGetRequest,
      AssetsGetRequest,
      AssetDbResponse,
      Asset
    >({
      transformInput: ok,
      getData: (req) => {
        return cache.get(req).matchWith({
          Just: ({ value }) => taskOf(just(value)),
          Nothing: () =>
            getByIdPg<AssetDbResponse, string>({
              name: SERVICE_NAME.GET,
              sql: sql.get,
              pg,
            })(req).map(
              tap((maybeResp) => forEach((x) => cache.set(req, x), maybeResp))
            ),
        });
      },
      validateResult: validateResult(resultSchema, SERVICE_NAME.GET),
      transformResult: (res) => res.map(transformDbResponse),
      emitEvent,
    }),

    mget: createMgetResolver<
      AssetsMgetRequest,
      AssetsMgetRequest,
      AssetDbResponse,
      Asset
    >({
      transformInput: ok,
      getData: (request) => {
        let results: Array<Maybe<AssetDbResponse>> = request.map((x) =>
          cache.get(x)
        );

        const notCachedIndexes = results.reduce<number[]>((acc, x, i) => {
          if (isEmpty(x)) acc.push(i);
          return acc;
        }, []);

        const notCachedAssetIds = notCachedIndexes.map((i) => request[i]);

        return mgetByIdsPg<AssetDbResponse, string>({
          name: SERVICE_NAME.MGET,
          sql: sql.mget,
          matchRequestResult: propEq('asset_id'),
          pg,
        })(notCachedAssetIds).map((fromDb) => {
          fromDb.forEach((assetInfo, index) =>
            forEach((value) => {
              results[notCachedIndexes[index]] = assetInfo;
              cache.set(notCachedAssetIds[index], value);
            }, assetInfo)
          );
          return results;
        });
      },
      validateResult: validateResult(resultSchema, SERVICE_NAME.MGET),
      transformResult: transformMgetResults<
        string[],
        AssetDbResponse,
        AssetInfo
      >(transformDbResponse),
      emitEvent,
    }),

    search: searchPreset<
      Cursor,
      AssetsSearchRequest,
      AssetDbResponse,
      AssetInfo
    >({
      name: SERVICE_NAME.SEARCH,
      sql: sql.search,
      resultSchema,
      transformResult: transformDbResponse,
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
