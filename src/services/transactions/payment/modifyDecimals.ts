import { Task } from 'folktale/concurrency/task';
import { zipWith, splitEvery } from 'ramda';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { withDecimals } from '../_common/withDecimals';
import { PaymentTx } from './repo/types';

export const modifyDecimals = (assetsService: AssetsService) => (
  txs: PaymentTx[]
): Task<AppError, PaymentTx[]> =>
  withDecimals(
    assetsService,
    txs
      .map((tx) => [
        {
          value: tx.fee,
          assetId: 'WAVES',
        },
        {
          value: tx.amount,
          assetId: 'WAVES',
        },
      ])
      .reduce((acc, cur) => acc.concat(cur), [])
  ).map((v) =>
    zipWith(
      (tx, [fee, amount]) => ({
        ...tx,
        fee: fee,
        amount: amount,
      }),
      txs,
      splitEvery(2, v)
    )
  );
