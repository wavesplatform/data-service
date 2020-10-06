import { Task } from 'folktale/concurrency/task';
import { zipWith, splitEvery } from 'ramda';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { withDecimals } from '../_common/withDecimals';
import { IssueTx } from './repo/types';

export const modifyDecimals = (assetsService: AssetsService) => (
  txs: IssueTx[]
): Task<AppError, IssueTx[]> =>
  withDecimals(
    assetsService,
    txs
      .map((tx) => [
        {
          value: tx.fee,
          assetId: 'WAVES',
        },
        {
          value: tx.quantity,
          assetId: tx.assetId,
        },
      ])
      .reduce((acc, cur) => acc.concat(cur), [])
  ).map((v) =>
    zipWith(
      (tx, [fee, quantity]) => ({
        ...tx,
        fee: fee,
        quantity: quantity,
      }),
      txs,
      splitEvery(2, v)
    )
  );
