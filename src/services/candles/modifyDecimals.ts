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
        let decimals = -8 - priceAssetPrecision + amountAssetPrecision;

        return taskOf(
          candles.map((candle) =>
            candle.txsCount === 0
              ? candle
              : {
                ...candle,
                low: candle.low.shiftedBy(decimals).decimalPlaces(-decimals),
                high: candle.high.shiftedBy(decimals).decimalPlaces(-decimals),
                open:
                  candle.open === null
                    ? null
                    : candle.open.shiftedBy(decimals).decimalPlaces(-decimals),
                close:
                  candle.close === null
                    ? null
                    : candle.close.shiftedBy(decimals).decimalPlaces(-decimals),
                volume: candle.volume
                  .shiftedBy(-amountAssetPrecision)
                  .decimalPlaces(amountAssetPrecision),
                quoteVolume: candle.quoteVolume
                  .shiftedBy(-amountAssetPrecision + decimals)
                  .decimalPlaces(priceAssetPrecision),
                weightedAveragePrice: candle.weightedAveragePrice
                  .shiftedBy(decimals)
                  .decimalPlaces(-decimals),
              }
          )
        );
      });
