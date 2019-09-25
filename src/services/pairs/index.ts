import { identity } from 'ramda';
import { of as taskOf, Task } from 'folktale/concurrency/task';
import { of as just, Maybe } from 'folktale/maybe';

import { forEach, isEmpty } from '../../utils/fp/maybeOps';
import { tap } from '../../utils/tap';

import { AppError } from '../../errorHandling';
import {
  pair,
  PairInfo,
  Pair,
  List,
  Service,
  CacheSync,
  AssetIdsPair,
} from '../../types';
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
import {
  inputGet,
  inputMget,
  inputSearch,
  result as resultSchema,
} from './schema';
import { transformResults as transformResultMget } from './transformResults';
import {
  PairDbResponse,
  transformResult,
  transformResultSearch,
} from './transformResult';
import * as sql from './sql';

export type PairsGetRequest = {
  pair: AssetIdsPair;
  matcher: string;
};

export type PairsMgetRequest = { pairs: AssetIdsPair[]; matcher: string };

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

export default ({
  drivers,
  emitEvent,
  validatePairs,
  cache,
}: CommonServiceDependencies & {
  validatePairs: (
    matcher: string,
    pairs: AssetIdsPair[]
  ) => Task<AppError, void>;
  cache: CacheSync<PairsGetRequest, PairDbResponse>;
}): PairsService => {
  const SERVICE_NAME = {
    GET: 'pairs.get',
    MGET: 'pairs.mget',
    SEARCH: 'pairs.search',
  };

  const get = createGetResolver<
    PairsGetRequest,
    PairsGetRequest,
    PairDbResponse,
    Pair
  >({
    transformInput: identity,
    validateInput: value =>
      validateInput<PairsGetRequest>(inputGet, SERVICE_NAME.GET)(value).chain(
        v => validatePairs(v.matcher, [v.pair]).map(() => v)
      ),

    // cache first
    getData: req =>
      cache.get(req).matchWith({
        Just: ({ value }) => taskOf(just(value)),
        Nothing: () =>
          getByIdPg<PairDbResponse, PairsGetRequest>({
            name: SERVICE_NAME.GET,
            sql: sql.get,
            pg: drivers.pg,
          })(req).map(
            tap(maybeResp => forEach(x => cache.set(req, x), maybeResp))
          ),
      }),
    validateResult: validateResult(resultSchema, SERVICE_NAME.GET),
    transformResult: res => res.map(
      res => pair(transformResult(res), { amountAsset: res.amount_asset_id, priceAsset: res.price_asset_id })
    ),
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
      validateInput<PairsMgetRequest>(inputMget, SERVICE_NAME.MGET)(
        value
      ).chain(v => validatePairs(v.matcher, v.pairs).map(() => v)),
    getData: request => {
      let results: Array<Maybe<PairDbResponse>> = request.pairs.map(p =>
        cache.get({
          pair: p,
          matcher: request.matcher,
        })
      );

      const notCachedIndexes = results.reduce<number[]>((acc, x, i) => {
        if (isEmpty(x)) acc.push(i);
        return acc;
      }, []);

      const notCachedPairs = notCachedIndexes.map(i => request.pairs[i]);

      return mgetPairsPg({
        name: SERVICE_NAME.MGET,
        sql: sql.mget,
        matchRequestResult,
        pg: drivers.pg,
      })({
        pairs: notCachedPairs,
        matcher: request.matcher,
      }).map(pairsFromDb => {
        pairsFromDb.forEach((pair, index) =>
          forEach(p => {
            results[notCachedIndexes[index]] = pair;
            cache.set(
              {
                matcher: request.matcher,
                pair: notCachedPairs[index],
              },
              p
            );
          }, pair)
        );
        return results;
      });
    },
    validateResult: validateResult(resultSchema, SERVICE_NAME.MGET),
    transformResult: transformResultMget,
    emitEvent,
  });

  const search = searchPreset<
    PairsSearchRequest,
    PairDbResponse,
    PairInfo,
    List<Pair>
  >({
    name: SERVICE_NAME.SEARCH,
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
