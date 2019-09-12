import { identity } from 'ramda';
import { of as taskOf, rejected } from 'folktale/concurrency/task';
import { of as just } from 'folktale/maybe';

import { ValidationError } from '../../errorHandling';
import { pair, PairInfo, Pair, List, Service, Cache } from '../../types';
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

const cacheKeyFromPair = (p: AssetPair): string => p.amountAsset + p.priceAsset;

export default ({ drivers, emitEvent }: CommonServiceDependencies) => ({
  validatePairs,
  cache,
}: {
  validatePairs: ValidateAsync<ValidationError, AssetPair[]>;
  cache: Cache<PairsGetRequest, PairDbResponse>;
}): Service<PairsGetRequest, PairsMgetRequest, PairsSearchRequest, Pair> => {
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
    dbQuery: pg => req =>
      cache.get(req).chain(maybeRes =>
        maybeRes.matchWith({
          Just: ({ value }) => taskOf(just(value)),
          Nothing: () =>
            getByIdPg<PairDbResponse, PairsGetRequest>({
              name: 'pairs.get',
              sql: sql.get,
            })(pg)(req).map(maybeResp => {
              // fill cache
              maybeResp.matchWith({
                Just: ({ value }) =>
                  cache
                    .set(req, value)
                    .run()
                    .listen({ onRejected: () => {} }),
                Nothing: () => {},
              });
              return maybeResp;
            }),
        })
      ),
    validateResult: validateResult(resultSchema, name),
    transformResult: res => res.map(transformResult).map(pair),
  })({ db: drivers.pg, emitEvent });

  // @todo mget cache
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
    dbQuery: mgetPairsPg({
      name: 'pairs.mget',
      sql: sql.mget,
      matchRequestResult,
    }),
    validateResult: validateResult(resultSchema, name),
    transformResult: transformResultMget,
  })({ db: drivers.pg, emitEvent });

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
