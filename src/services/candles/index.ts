import { Task } from 'folktale/concurrency/task';
import { AppError } from '../../errorHandling';
import { Service, SearchedItems, CandleInfo, AssetIdsPair } from '../../types';
import { searchWithDecimalsProcessing } from '../_common/transformation/withDecimalsProcessing';
import { AssetsService } from '../assets';
import { MoneyFormat, WithMoneyFormat } from '../types';
import { CandlesSearchRequest, CandlesRepo } from './repo';
import { modifyDecimals } from './modifyDecimals';

export type CandlesServiceSearchRequest = CandlesSearchRequest &
  WithMoneyFormat;
export type CandlesService = {
  search: Service<CandlesServiceSearchRequest, SearchedItems<CandleInfo>>;
  searchLast: Service<CandlesServiceSearchRequest, CandleInfo | null>;
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
        repo.search,
      )(req).map((result) => ({
        ...result,
        // weightedAveragePrice can be float after candles concatenation because of dividing
        // but for long moneyFormat it should be long
        items:
          req.moneyFormat === MoneyFormat.Long
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
  searchLast: (req) =>
    validatePairs(req.matcher, [
      {
        amountAsset: req.amountAsset,
        priceAsset: req.priceAsset,
      },
    ]).chain(() =>
      searchWithDecimalsProcessing<CandlesServiceSearchRequest, CandleInfo>(
        modifyDecimals(assetsService, [req.amountAsset, req.priceAsset]),
        repo.searchLast
      )(req).map((result) => (
        result && Array.isArray(result.items) && result.items[0] ? {
          ...result.items[0],
          weightedAveragePrice: result.items[0].txsCount > 0 ?
            result.items[0].weightedAveragePrice.decimalPlaces(0) : result.items[0].weightedAveragePrice
        } : null)
    )
    )
});
