import { Task } from 'folktale/concurrency/task';
import { defaultTo, zipWith, splitEvery } from 'ramda';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { withDecimals } from '../_common/withDecimals';
import { TransferTx } from './repo/types';

export const modifyDecimals = (assetsService: AssetsService) => (
  txs: TransferTx[]
): Task<AppError, TransferTx[]> =>
  withDecimals(
    assetsService,
    txs
      .map((tx) => [
        {
          value: tx.fee,
          assetId: defaultTo('WAVES', tx.feeAsset),
        },
        {
          value: tx.amount,
          assetId: tx.assetId,
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
