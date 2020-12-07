import { Task, of as taskOf } from 'folktale/concurrency/task';
import { AppError } from '../../errorHandling';
import { CandleInfo } from '../../types';
import { AssetsService } from '../assets';

export const modifyDecimals = <T extends CandleInfo>(
  assetsService: AssetsService,
  ids: string[]
) => (candles: T[]): Task<AppError, T[]> =>
  assetsService
    .precisions({
      ids,
    })
    .chain(([amountAssetPrecision, priceAssetPrecision]) => {
      let decimals = 10 ** (-8 - priceAssetPrecision + amountAssetPrecision);
      let places = 8 + priceAssetPrecision - amountAssetPrecision;

      return taskOf(
        candles.map((candle) =>
          candle.txsCount === 0
            ? candle
            : {
                ...candle,
                low: candle.low.multipliedBy(decimals).decimalPlaces(places),
                high: candle.high.multipliedBy(decimals).decimalPlaces(places),
                open:
                  candle.open === null
                    ? null
                    : candle.open.multipliedBy(decimals).decimalPlaces(places),
                close:
                  candle.close === null
                    ? null
                    : candle.close.multipliedBy(decimals).decimalPlaces(places),
                volume: candle.volume
                  .multipliedBy(10 ** -amountAssetPrecision)
                  .decimalPlaces(amountAssetPrecision),
                quoteVolume: candle.quoteVolume
                  .multipliedBy(10 ** -amountAssetPrecision * decimals)
                  .decimalPlaces(priceAssetPrecision),
                weightedAveragePrice: candle.weightedAveragePrice
                  .multipliedBy(decimals)
                  .decimalPlaces(places),
              }
        )
      );
    });
