import { Task, of as taskOf } from 'folktale/concurrency/task';
import { AppError } from '../../errorHandling';
import { AssetIdsPair, PairInfo } from '../../types';
import { AssetsService } from '../assets';

export const modifyDecimals = <T extends PairInfo & AssetIdsPair>(
  assetsService: AssetsService
) => (pairs: T[]): Task<AppError, T[]> =>
    assetsService
      .precisions({
        ids: pairs.reduce<string[]>(
          (acc, pair) => acc.concat([pair.amountAsset, pair.priceAsset]),
          []
        ),
      })
      .chain((precisions) => {
        return taskOf(
          pairs.map((pair, idx) => {
            const amountAssetDecimals = precisions[idx * 2];
            const priceAssetDecimals = precisions[idx * 2 + 1];
            const priceDecimals = -8 - priceAssetDecimals + amountAssetDecimals;

            return {
              ...pair,
              low: pair.low.shiftedBy(priceDecimals),
              high: pair.high.shiftedBy(priceDecimals),
              firstPrice: pair.firstPrice.shiftedBy(priceDecimals),
              lastPrice: pair.lastPrice.shiftedBy(priceDecimals),
              volume: pair.volume.shiftedBy(-amountAssetDecimals),
              quoteVolume: pair.quoteVolume.shiftedBy(priceDecimals - amountAssetDecimals),
              volumeWaves:
                pair.volumeWaves === null
                  ? null
                  : pair.amountAsset === 'WAVES'
                    ? pair.volumeWaves.shiftedBy(-amountAssetDecimals)
                    : pair.volumeWaves.shiftedBy(priceDecimals - amountAssetDecimals),
              weightedAveragePrice: pair.weightedAveragePrice.shiftedBy(priceDecimals),
            };
          })
        );
      });
