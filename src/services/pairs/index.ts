import { Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';
import { AppError } from '../../errorHandling';
import { Service, SearchedItems, AssetIdsPair, PairInfo } from '../../types';
import {
  getWithDecimalsProcessing,
  mgetWithDecimalsProcessing,
  searchWithDecimalsProcessing,
} from '../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../assets';
import { WithMoneyFormat } from '../types';
import {
  PairsGetRequest,
  PairsMgetRequest,
  PairsSearchRequest,
  PairsRepo,
} from './repo/types';
import { modifyDecimals } from './modifyDecimals';

export type PairsServiceMgetRequest = PairsMgetRequest;
export type PairsServiceSearchRequest = PairsSearchRequest;
export type PairsService = {
  get: Service<
    PairsGetRequest & WithMoneyFormat,
    Maybe<PairInfo & AssetIdsPair>
  >;
  mget: Service<
    PairsServiceMgetRequest & WithMoneyFormat,
    Maybe<PairInfo & AssetIdsPair>[]
  >;
  search: Service<
    PairsSearchRequest & WithMoneyFormat,
    SearchedItems<PairInfo & AssetIdsPair>
  >;
};

export default (
  repo: PairsRepo,
  validatePairs: (
    matcher: string,
    pairs: AssetIdsPair[]
  ) => Task<AppError, void>,
  assetsService: AssetsService
): PairsService => ({
  get: (req) =>
    validatePairs(req.matcher, [req.pair]).chain(() =>
      getWithDecimalsProcessing<
        PairsGetRequest & WithMoneyFormat,
        PairInfo & AssetIdsPair
      >(
        modifyDecimals(assetsService),
        repo.get
      )(req)
    ),
  mget: (req) =>
    validatePairs(req.matcher, req.pairs).chain(() =>
      mgetWithDecimalsProcessing<
        PairsServiceMgetRequest & WithMoneyFormat,
        PairInfo & AssetIdsPair
      >(
        modifyDecimals(assetsService),
        repo.mget
      )(req)
    ),
  search: (req) =>
    searchWithDecimalsProcessing<
      PairsSearchRequest & WithMoneyFormat,
      PairInfo & AssetIdsPair
    >(
      modifyDecimals(assetsService),
      repo.search
    )(req),
});
