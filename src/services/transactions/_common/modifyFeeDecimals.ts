import { BigNumber } from '@waves/data-entities';
import { Task } from 'folktale/concurrency/task';
import { zipWith } from 'ramda';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';

export const modifyFeeDecimals = <
  T extends { fee: BigNumber; feeAsset?: string }
>(
  assetsService: AssetsService
) => (txs: T[]): Task<AppError, T[]> =>
  assetsService.precisions({ ids: ['WAVES'] }).map(
    zipWith(
      (tx, feeAssetPrecision) => ({
        ...tx,
        fee: tx.fee.dividedBy(10 ** feeAssetPrecision),
      }),
      txs
    )
  );
