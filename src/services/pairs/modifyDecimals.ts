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
          const amountAssetDecimals = -precisions[idx * 2];
          const priceAssetDecimals = -8 - precisions[idx * 2 + 1];
          const decimals = priceAssetDecimals + precisions[idx * 2];

          return {
            ...pair,
            low: pair.low.shiftedBy(decimals),
            high: pair.high.shiftedBy(decimals),
            firstPrice: pair.firstPrice.shiftedBy(decimals),
            lastPrice: pair.lastPrice.shiftedBy(decimals),
            volume: pair.volume.shiftedBy(amountAssetDecimals),
            quoteVolume: pair.quoteVolume.shiftedBy(priceAssetDecimals),
            volumeWaves:
              pair.volumeWaves === null
                ? null
                : pair.amountAsset === 'WAVES'
                ? pair.volumeWaves.shiftedBy(amountAssetDecimals)
                : pair.volumeWaves.shiftedBy(priceAssetDecimals),
            weightedAveragePrice: pair.weightedAveragePrice.shiftedBy(decimals),
          };
        })
      );
    });
