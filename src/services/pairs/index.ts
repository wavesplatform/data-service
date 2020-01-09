import { Task, waitAll } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';

import { AppError } from '../../errorHandling';

import { Service, SearchedItems, AssetIdsPair, PairInfo } from '../../types';
import { WithDecimalsFormat } from '../types';
import {
  PairsGetRequest,
  PairsMgetRequest,
  PairsSearchRequest,
  PairsRepo,
} from './repo/types';

export type PairsServiceSearchRequest = PairsSearchRequest;

export type PairsService = {
  get: Service<PairsGetRequest & WithDecimalsFormat, Maybe<PairInfo>>;
  mget: Service<PairsMgetRequest & WithDecimalsFormat, Maybe<PairInfo>[]>;
  search: Service<
    PairsSearchRequest & WithDecimalsFormat,
    SearchedItems<PairInfo>
  >;
};

export default (
  repo: PairsRepo,
  validatePair: (matcher: string, pair: AssetIdsPair) => Task<AppError, void>
): PairsService => ({
  get: req => {
    return validatePair(req.matcher, req.pair).chain(() => {
      return repo.get(req);
    });
  },
  mget: req => {
    return waitAll(
      req.pairs.map(pair => validatePair(req.matcher, pair))
    ).chain(() => {
      return repo.mget(req);
    });
  },
  search: req => {
    return repo.search(req);
  },
});
