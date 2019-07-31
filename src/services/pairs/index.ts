import { Maybe } from 'folktale/maybe';
import { Task, of as taskOf, rejected } from 'folktale/concurrency/task';
import * as LRU from 'lru-cache';
import { createOrderPair } from '@waves/assets-pairs-order';

import { loadMatcherSettings } from '../../loadMatcherSettings';
import { AppError, ValidationError } from '../../errorHandling';
import {
  pair,
  PairInfo,
  Pair,
  List,
  ServiceGet,
  ServiceMget,
  ServiceSearch,
  TransactionInfo,
} from '../../types';
import { CommonServiceCreatorDependencies } from '..';
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
} from './transformResult';
import * as sql from './sql';
import { DataServiceConfig } from 'loadConfig';
import { IssueTxsService } from '../transactions/issue';

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

export type PairsServiceCreatorDependencies = CommonServiceCreatorDependencies & {
  options: DataServiceConfig;
};

export type PairsService =
  | ServiceGet<PairsGetRequest, Pair>
  | ServiceMget<PairsMgetRequest, Pair>
  | ServiceSearch<PairsSearchRequest, Pair>;

export default ({
  drivers,
  emitEvent,
  options,
}: PairsServiceCreatorDependencies) => ({
  issueTxs,
}: {
  issueTxs: IssueTxsService;
}): Task<AppError, PairsService> => {
  const cache = new LRU(100000);
  cache.set('WAVES', true);

  const service = (priceAssets: string[] | null): PairsService => {
    const orderPair = priceAssets ? createOrderPair(priceAssets) : null;

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
            maybePair.matchWith({
              Just: () => taskOf(maybePair),
              Nothing: () => rejected(new ValidationError('Pair not found')),
            })
        );

        // request asset list
        const assets = [request.amountAsset, request.priceAsset];

        // try to check asset existance through the cache
        const notCached = assets.filter(assetId => !cache.has(assetId));

        if (notCached.length === 0) {
          // both of assets are cached
          return getPairT;
        } else {
          return issueTxs.mget(notCached).chain(list => {
            const found = list.data
              .map(tx => tx.data)
              .filter(
                (t: TransactionInfo | null): t is TransactionInfo => t !== null
              );

            if (found.length < notCached.length) {
              return rejected(new ValidationError(new Error('Check pair')));
            } else {
              found.forEach(tx => cache.set(tx.id, true));
              return getPairT;
            }
          });
        }
      },
      mget: (request: PairsMgetRequest) => {
        const mgetPairsT = mgetPairsByRequest(request);

        // request asset list
        const assets = request.reduce(
          (acc: string[], pair) => [...acc, pair.amountAsset, pair.priceAsset],
          []
        );

        // try to check asset existance through the cache
        const notCached = assets.filter(assetId => !cache.has(assetId));

        if (notCached.length === 0) {
          // all of assets are in cache
          return mgetPairsT;
        } else {
          return issueTxs.mget(notCached).chain(list => {
            const found = list.data
              .map(tx => tx.data)
              .filter(
                (t: TransactionInfo | null): t is TransactionInfo => t !== null
              );

            if (found.length < notCached.length) {
              return rejected(new ValidationError(new Error('Check pairs')));
            } else {
              found.forEach(tx => cache.set(tx.id, true));
              return mgetPairsT;
            }
          });
        }
      },
      search: searchPairsByRequest,
    };
  };

  return loadMatcherSettings(options)
    .map(settings => service(settings.priceAssets))
    .orElse(() => taskOf(service(null)));
};
