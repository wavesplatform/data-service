import { BigNumber } from '@waves/data-entities';
import { Task } from 'folktale/concurrency/task';
import { zipWith } from 'ramda';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { withDecimals } from '../_common/withDecimals';

export const modifyFeeDecimals = <
  T extends { fee: BigNumber; feeAsset?: string }
>(
  assetsService: AssetsService
) => (txs: T[]): Task<AppError, T[]> =>
  withDecimals(
    assetsService,
    txs.map((tx) => ({
      value: tx.fee,
      assetId: 'WAVES',
    }))
  ).map(
    zipWith(
      (tx, fee) => ({
        ...tx,
        fee: fee,
      }),
      txs
    )
  );
