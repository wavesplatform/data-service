import { of as maybeOf, Maybe } from 'folktale/maybe';
import { of as taskOf, rejected, Task } from 'folktale/concurrency/task';
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

import {
  PairsServiceCreatorDependencies,
  ServiceMesh,
} from '../../middleware/injectServices';
import {
  pair,
  PairInfo,
  Pair,
  List,
  ServiceGet,
  ServiceMget,
  ServiceSearch,
  Transaction,
  TransactionInfo,
  NotNullTransaction,
} from '../../types';
import { getByIdPreset } from '../presets/pg/getById';
import { mgetByIdsPreset } from '../presets/pg/mgetByIds';
import { searchPreset } from '../presets/pg/search';

import * as matchRequestResult from './matchRequestResult';
import {
  inputGet,
  inputMget,
  inputSearch,
  result as resultSchema,
} from './schema';
import {
  PairDbResponse,
  transformResult,
  transformResultSearch,
  createEmptyPair,
} from './transformResult';
import * as sql from './sql';
import { AppError, ResolverError } from 'errorHandling';

export type PairsGetRequest = {
  amountAsset: string;
  priceAsset: string;
};

export type PairsMgetRequest = PairsGetRequest[];

export type SearchWithLimitRequest = {
  limit: number;
};

export type SearchWithMatchExactly = SearchWithLimitRequest & {
  match_exactly?: boolean[];
};

export type SearchByAssetRequest = SearchWithMatchExactly & {
  search_by_asset: string;
};

export type SearchByAssetsRequest = SearchWithMatchExactly & {
  search_by_assets: [string, string];
};

export type PairsSearchRequest =
  | SearchWithLimitRequest
  | SearchByAssetRequest
  | SearchByAssetsRequest;

export type PairsService =
  | ServiceGet<PairsGetRequest, Pair>
  | ServiceMget<PairsMgetRequest, Pair>
  | ServiceSearch<PairsSearchRequest, Pair>;

export default ({
  drivers,
  emitEvent,
  orderPair,
  cache,
}: PairsServiceCreatorDependencies) => (serviceMesh: ServiceMesh) => {
  const getPairByRequest = getByIdPreset<
    PairsGetRequest,
    PairDbResponse,
    any,
    Pair
  >({
    name: 'pairs.get',
    sql: sql.get,
    inputSchema: inputGet(orderPair),
    resultSchema,
    transformResult: transformResult,
    resultTypeFactory: pair,
  })({ pg: drivers.pg, emitEvent });

  const mgetPairsByRequest = mgetByIdsPreset<
    PairsGetRequest,
    PairDbResponse,
    any,
    Pair
  >({
    name: 'pairs.mget',
    sql: sql.mget,
    inputSchema: inputMget(orderPair),
    resultSchema,
    transformResult: transformResult,
    matchRequestResult: matchRequestResult,
    resultTypeFactory: pair,
  })({ pg: drivers.pg, emitEvent });

  const searchPairsByRequest = searchPreset<
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
    get: (request: PairsGetRequest) => {
      const getPairT = getPairByRequest(request).chain<AppError, Maybe<Pair>>(
        maybePair =>
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
        return serviceMesh.issueTxs
          ? serviceMesh.issueTxs
              .mget(notCached)
              .chain<AppError, Pair | Maybe<unknown>>(
                compose(
                  cond<number, Task<AppError, Maybe<unknown>>>([
                    [equals(notCached.length), () => getPairT],
                    [
                      T,
                      () =>
                        rejected(new ResolverError(new Error('Check pair'))),
                    ],
                  ]),
                  (l: TransactionInfo[]) => length(l),
                  tap(forEach((tx: TransactionInfo) => cache.set(tx.id, true))),
                  map((tx: NotNullTransaction) => tx.data),
                  (l: Transaction[]): any[] =>
                    filter((tx: Transaction) => tx.data !== null)(l),
                  (list: List<Transaction>): Transaction[] => list.data
                )
              )
          : rejected(
              new ResolverError(
                new Error('Issue txs service is not initialized')
              )
            );
      }
    },
    mget: (request: PairsMgetRequest) => {
      const mgetPairsT = mgetPairsByRequest(request);

      // request asset list
      const assets = request
        .reduce(
          (acc: string[], pair) => [...acc, pair.amountAsset, pair.priceAsset],
          []
        )
        .filter(assetId => assetId !== 'WAVES');

      // try to check asset existance through the cache
      const notCached = assets.filter(assetId => !cache.has(assetId));

      if (notCached.length === 0) {
        // all of assets are in cache
        return mgetPairsT;
      } else {
        return serviceMesh.issueTxs
          ? serviceMesh.issueTxs.mget(notCached).chain(
              compose(
                cond([
                  [equals(notCached.length), () => mgetPairsT],
                  [
                    T,
                    () => rejected(new ResolverError(new Error('Check pairs'))),
                  ],
                ]),
                length,
                tap(forEach((tx: TransactionInfo) => cache.set(tx.id, true))),
                map((tx: NotNullTransaction) => tx.data),
                (l: Transaction[]): any[] =>
                  filter((tx: Transaction) => tx.data !== null)(l),
                (list: List<Transaction>): Transaction[] => list.data
              )
            )
          : rejected(
              new ResolverError(
                new Error('Issue txs service is not initialized')
              )
            );
      }
    },
    search: searchPairsByRequest,
  };
};
