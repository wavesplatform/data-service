import { identity, zip } from 'ramda';
import { of as taskOf } from 'folktale/concurrency/task';
import { of as just, Maybe } from 'folktale/maybe';

import { forEach, isEmpty } from '../../utils/fp/maybeOps';
import { tap } from '../../utils/tap';

import { ValidationError } from '../../errorHandling';
import { pair, PairInfo, Pair, List, Service, CacheSync } from '../../types';
import { CommonServiceDependencies } from '..';

// resolver creation and presets
import {
  get as createGetResolver,
  mget as createMgetResolver,
} from '../_common/createResolver';
import { getData as getByIdPg } from '../presets/pg/getById/pg';
import { validateInput, validateResult } from '../presets/validation';
import { searchPreset } from '../presets/pg/search';

// service logic
import { matchRequestResult } from './matchRequestResult';
import { mgetPairsPg } from './mgetPairsPg';
import { inputGet, inputSearch, result as resultSchema } from './schema';
import { transformResults as transformResultMget } from './transformResults';
import {
  PairDbResponse,
  transformResult,
  transformResultSearch,
} from './transformResult';
import * as sql from './sql';
import { Pair as AssetPair } from './types';
import { ValidateAsync } from '../_common/createResolver/types';
import { inputMget } from '../presets/pg/mgetByIds/inputSchema';

export type PairsGetRequest = {
  pair: AssetPair;
  matcher: string;
};

export type PairsMgetRequest = { pairs: AssetPair[]; matcher: string };

export type SearchCommonRequest = {
  matcher: string;
  limit: number;
};

export type SearchWithMatchExactly = SearchCommonRequest & {
  match_exactly?: boolean[];
};

export type SearchByAssetRequest = SearchWithMatchExactly & {
  search_by_asset: string;
};

export type SearchByAssetsRequest = SearchWithMatchExactly & {
  search_by_assets: [string, string];
};

export type PairsSearchRequest =
  | SearchCommonRequest
  | SearchByAssetRequest
  | SearchByAssetsRequest;

export type PairsService = Service<
  PairsGetRequest,
  PairsMgetRequest,
  PairsSearchRequest,
  Pair
>;

export { create as createCache } from './cache';

export default ({ drivers, emitEvent }: CommonServiceDependencies) => ({
  validatePairs,
  cache,
}: {
  validatePairs: ValidateAsync<ValidationError, AssetPair[]>;
  cache: CacheSync<PairsGetRequest, PairDbResponse>;
}): PairsService => {
  const get = createGetResolver<
    PairsGetRequest,
    PairsGetRequest,
    PairDbResponse,
    Pair
  >({
    transformInput: identity,
    validateInput: value =>
      validateInput<PairsGetRequest>(inputGet, 'pairs.get')(value).chain(v =>
        validatePairs([v.pair]).map(() => v)
      ),

    // cache first
    getData: req =>
      cache.get(req).matchWith({
        Just: ({ value }) => taskOf(just(value)),
        Nothing: () =>
          getByIdPg<PairDbResponse, PairsGetRequest>({
            name: 'pairs.get',
            sql: sql.get,
            pg: drivers.pg,
          })(req).map(
            tap(maybeResp => forEach(x => cache.set(req, x), maybeResp))
          ),
      }),
    validateResult: validateResult(resultSchema, name),
    transformResult: res => res.map(transformResult).map(pair),
    emitEvent,
  });

  const mget = createMgetResolver<
    PairsMgetRequest,
    PairsMgetRequest,
    PairDbResponse,
    List<Pair>
  >({
    transformInput: identity,
    validateInput: value =>
      validateInput<PairsMgetRequest>(inputMget, 'pairs.mget')(value).chain(v =>
        validatePairs(v.pairs).map(() => v)
      ),
    getData: request => {
      let results: Array<Maybe<PairDbResponse>> = request.pairs.map(p =>
        cache.get({
          pair: p,
          matcher: request.matcher,
        })
      );

      const notCachedPairsIndexes = results.filter(isEmpty).map((_, i) => i);

      return mgetPairsPg({
        name: 'pairs.mget',
        sql: sql.mget,
        matchRequestResult,
        pg: drivers.pg,
      })({
        pairs: notCachedPairsIndexes.map(i => request.pairs[i]),
        matcher: request.matcher,
      }).map(pairsFromDb => {
        zip(pairsFromDb, notCachedPairsIndexes).forEach(
          ([pair, i]) => (results[i] = pair)
        );
        return results;
      });
    },
    validateResult: validateResult(resultSchema, name),
    transformResult: transformResultMget,
    emitEvent,
  });

  const search = searchPreset<
    PairsSearchRequest,
    PairDbResponse,
    PairInfo,
    List<Pair>
  >({
    name: 'pairs.search',
    sql: sql.search,
    inputSchema: inputSearch,
    resultSchema,
    transformResult: transformResultSearch,
  })({ pg: drivers.pg, emitEvent });

  return {
    get,
    mget,
    search,
  };
};
