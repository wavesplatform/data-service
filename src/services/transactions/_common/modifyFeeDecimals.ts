import { BigNumber } from '@waves/data-entities';
import { Task } from 'folktale/concurrency/task';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';

export const modifyFeeDecimals = <
  T extends { fee: BigNumber; feeAsset?: string }
>(
  assetsService: AssetsService
) => (txs: T[]): Task<AppError, T[]> =>
  assetsService.precisions({ ids: ['WAVES'] }).map(([feeAssetPrecision]) =>
    txs.map((tx) => ({
      ...tx,
      fee: tx.fee.shiftedBy(-feeAssetPrecision),
    }))
  );
