import { Task } from 'folktale/concurrency/task';

import { AppError } from '../../errorHandling';

import { Service, SearchedItems, CandleInfo, AssetIdsPair } from '../../types';

import { WithDecimalsFormat } from '../types';

import { CandlesSearchRequest, CandlesRepo } from './repo';

export type CandlesServiceSearchRequest = CandlesSearchRequest;

export type CandlesService = {
  search: Service<
    CandlesServiceSearchRequest & WithDecimalsFormat,
    SearchedItems<CandleInfo>
  >;
};

export default (
  repo: CandlesRepo,
  validatePair: (matcher: string, pair: AssetIdsPair) => Task<AppError, void>
): CandlesService => ({
  search: req => {
    return validatePair(req.matcher, {
      amountAsset: req.amountAsset,
      priceAsset: req.priceAsset,
    }).chain(() => {
      return repo.search(req);
    });
  },
});
