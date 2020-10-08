import { Task } from 'folktale/concurrency/task';
import { AppError } from '../../errorHandling';
import { Service, SearchedItems, CandleInfo, AssetIdsPair } from '../../types';
import { searchWithDecimalsProcessing } from '../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../assets';
import { DecimalsFormat, WithDecimalsFormat } from '../types';
import { CandlesSearchRequest, CandlesRepo } from './repo';
import { modifyDecimals } from './modifyDecimals';

export type CandlesServiceSearchRequest = CandlesSearchRequest &
  WithDecimalsFormat;
export type CandlesService = {
  search: Service<CandlesServiceSearchRequest, SearchedItems<CandleInfo>>;
};

export default (
  repo: CandlesRepo,
  validatePairs: (
    matcher: string,
    pairs: AssetIdsPair[]
  ) => Task<AppError, void>,
  assetsService: AssetsService
): CandlesService => ({
  search: (req) =>
    validatePairs(req.matcher, [
      {
        amountAsset: req.amountAsset,
        priceAsset: req.priceAsset,
      },
    ]).chain(() =>
      searchWithDecimalsProcessing<CandlesServiceSearchRequest, CandleInfo>(
        modifyDecimals(assetsService, [req.amountAsset, req.priceAsset]),
        repo.search
      )(req).map((result) => ({
        ...result,
        // weightedAveragePrice can be float after candles concatenation because of dividing
        // but for long decimalsFormat it should be long
        items:
          req.decimalsFormat === DecimalsFormat.Long
            ? result.items.map((candle) => ({
                ...candle,
                weightedAveragePrice:
                  candle.txsCount > 0
                    ? candle.weightedAveragePrice.decimalPlaces(0)
                    : // in fact it will be null
                      candle.weightedAveragePrice,
              }))
            : result.items,
      }))
    ),
});
