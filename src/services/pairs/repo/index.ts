import { of as taskOf } from 'folktale/concurrency/task';
import { of as just, Maybe } from 'folktale/maybe';
import { Ok as ok } from 'folktale/result';

import { forEach, isEmpty } from '../../../utils/fp/maybeOps';
import { tap } from '../../../utils/tap';

import { withStatementTimeout } from '../../../db/driver';
import { PairInfo, CacheSync } from '../../../types';
import { CommonRepoDependencies } from '../..';

// resolver creation and presets
import {
  get as createGetResolver,
  mget as createMgetResolver,
} from '../../_common/createResolver';
import { getData as getByIdPg } from '../../_common/presets/pg/getById/pg';
import { validateResult } from '../../_common/presets/validation';
import { searchPreset } from '../../_common/presets/pg/search';

// service logic
export { create as createCache } from './cache';
import { serialize, deserialize, Cursor } from './cursor';
import { matchRequestResult } from './matchRequestResult';
import { mgetPairsPg } from './mgetPairsPg';
import { result as resultSchema } from './schema';
import {
  PairDbResponse,
  transformResult,
  toPairInfo,
  PairResponse,
} from './transformResult';
import * as sql from './sql';
import {
  PairsGetRequest,
  PairsMgetRequest,
  PairsRepo,
  PairsSearchRequest,
} from './types';

export default ({
  drivers,
  emitEvent,
  timeouts,
  cache,
}: CommonRepoDependencies & {
  cache: CacheSync<PairsGetRequest, PairDbResponse>;
}): PairsRepo => {
  const SERVICE_NAME = {
    GET: 'pairs.get',
    MGET: 'pairs.mget',
    SEARCH: 'pairs.search',
  };

  const get = createGetResolver<
    PairsGetRequest,
    PairsGetRequest,
    PairDbResponse,
    PairInfo
  >({
    transformInput: ok,

    // cache first
    getData: req =>
      cache.get(req).matchWith({
        Just: ({ value }) => taskOf(just(value)),
        Nothing: () =>
          getByIdPg<PairDbResponse, PairsGetRequest>({
            name: SERVICE_NAME.GET,
            sql: sql.get,
            pg: withStatementTimeout(drivers.pg, timeouts.get),
          })(req).map(
            tap(maybeResp => forEach(x => cache.set(req, x), maybeResp))
          ),
      }),
    validateResult: validateResult(resultSchema, SERVICE_NAME.GET),
    transformResult: res =>
      res.map(res => transformResult(res) as PairResponse).map(toPairInfo),
    emitEvent,
  });

  const mget = createMgetResolver<
    PairsMgetRequest,
    PairsMgetRequest,
    PairDbResponse,
    PairInfo
  >({
    transformInput: ok,
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
        pg: withStatementTimeout(drivers.pg, timeouts.mget),
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
    transformResult: res =>
      res
        .map(m => m.map(p => transformResult(p) as PairResponse))
        .map(toPairInfo),
    emitEvent,
  });

  const search = searchPreset<
    Cursor,
    PairsSearchRequest,
    PairDbResponse,
    PairInfo
  >({
    name: SERVICE_NAME.SEARCH,
    sql: sql.search,
    resultSchema,
    transformResult: (p: PairDbResponse) => transformResult(p) as PairResponse,
    cursorSerialization: {
      serialize,
      deserialize,
    },
  })({
    pg: withStatementTimeout(drivers.pg, timeouts.search),
    emitEvent,
  });

  return {
    get,
    mget,
    search,
  };
};
