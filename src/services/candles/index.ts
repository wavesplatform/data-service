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
  validatePairs: (
    matcher: string,
    pairs: AssetIdsPair[]
  ) => Task<AppError, void>
): CandlesService => ({
  search: req =>
    validatePairs(req.matcher, [
      {
        amountAsset: req.amountAsset,
        priceAsset: req.priceAsset,
      },
    ]).chain(() => repo.search(req)),
});
