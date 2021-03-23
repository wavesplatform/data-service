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
            low: pair.low.multipliedBy(10 ** decimals),
            high: pair.high.multipliedBy(10 ** decimals),
            firstPrice: pair.firstPrice.multipliedBy(10 ** decimals),
            lastPrice: pair.lastPrice.multipliedBy(10 ** decimals),
            volume: pair.volume.multipliedBy(10 ** amountAssetDecimals),
            quoteVolume: pair.quoteVolume.multipliedBy(10 ** priceAssetDecimals),
            volumeWaves:
              pair.volumeWaves === null
                ? null
                : pair.amountAsset === 'WAVES'
                ? pair.volumeWaves.multipliedBy(10 ** amountAssetDecimals)
                : pair.volumeWaves.multipliedBy(10 ** priceAssetDecimals),
            weightedAveragePrice: pair.weightedAveragePrice.multipliedBy(10 ** decimals),
          };
        })
      );
    });
