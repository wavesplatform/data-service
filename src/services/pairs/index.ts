import { Service, ServiceMesh } from '../../types';

import {
  compose,
  cond,
  equals,
  filter,
  forEach,
  length,
  map,
  T,
  tap,
} from 'ramda';
import { of as maybeOf, empty } from 'folktale/maybe';
import { of as taskOf } from 'folktale/concurrency/task';
import { getByIdPreset } from '../presets/pg/getById';
import { mgetByIdsPreset } from '../presets/pg/mgetByIds';
import { searchPreset } from '../presets/pg/search';
import { pair, Pair } from '../../types';

import { PairsServiceCreatorDependencies } from '../../middleware/injectServices';

import {
  inputGet,
  inputMget,
  inputSearch,
  result as resultSchema,
} from './schema';
import {
  transformResult,
  transformResultSearch,
  createEmptyPair,
} from './transformResult';
import * as sql from './sql';
import * as matchRequestResult from './matchRequestResult';

export default ({
  drivers,
  emitEvent,
  orderPair,
  cache,
}: PairsServiceCreatorDependencies) => (
  serviceMesh: ServiceMesh
): Service<Pair> => {
  const getPairByRequest = getByIdPreset({
    name: 'pairs.get',
    sql: sql.get,
    inputSchema: inputGet(orderPair),
    resultSchema,
    transformResult: transformResult,
    resultTypeFactory: pair,
  })({ pg: drivers.pg, emitEvent });

  const mgetPairsByRequest = mgetByIdsPreset({
    name: 'pairs.mget',
    sql: sql.mget,
    inputSchema: inputMget(orderPair),
    resultSchema,
    transformResult: transformResult,
    matchRequestResult: matchRequestResult,
    resultTypeFactory: pair,
  })({ pg: drivers.pg, emitEvent });

  const searchPairsByRequest = searchPreset({
    name: 'pairs.search',
    sql: sql.search,
    inputSchema: inputSearch,
    resultSchema,
    transformResult: transformResultSearch,
  })({ pg: drivers.pg, emitEvent });

  return {
    get: request => {
      const getPairT = getPairByRequest(request).chain(maybePair =>
        taskOf(
          maybePair.matchWith({
            Just: () => maybePair,
            Nothing: () => maybeOf(createEmptyPair()),
          })
        )
      );

      // request asset list
      const assets = [request.amountAsset, request.priceAsset];

      // try to check asset existance through the cache
      const notCached = assets.filter(assetId => !cache.has(assetId));

      if (notCached.length === 0) {
        // both of assets are cached
        return getPairT;
      } else {
        return serviceMesh['issueTxs'].mget(notCached).chain(
          compose(
            cond([
              [equals(notCached.length), () => getPairT],
              [T, () => taskOf(empty())],
            ]),
            length,
            tap(forEach(tx => cache.set(tx.id, true))),
            map(tx => tx.data),
            filter(tx => tx.data !== null),
            list => list.data
          )
        );
      }
    },
    mget: request => {
      const mgetPairsT = mgetPairsByRequest(request);

      // request asset list
      const assets = request
        .reduce((acc, pair) => [...acc, pair.amountAsset, pair.priceAsset], [])
        .filter(assetId => assetId !== 'WAVES');

      // try to check asset existance through the cache
      const notCached = assets.filter(assetId => !cache.has(assetId));

      if (notCached.length === 0) {
        // all of assets are in cache
        return mgetPairsT;
      } else {
        return serviceMesh.issueTxs.mget(notCached).chain(
          compose(
            cond([
              [equals(notCached.length), () => mgetPairsT],
              [T, () => taskOf(null)],
            ]),
            length,
            tap(forEach(tx => cache.set(tx.id, true))),
            map(tx => tx.data),
            filter(tx => tx.data !== null),
            list => list.data
          )
        );
      }
    },
    search: searchPairsByRequest,
  };
};
