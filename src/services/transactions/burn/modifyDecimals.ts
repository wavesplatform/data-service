import { Task } from 'folktale/concurrency/task';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { BurnTx } from './repo/types';

export const modifyDecimals = (assetsService: AssetsService) => (
  txs: BurnTx[]
): Task<AppError, BurnTx[]> =>
  assetsService
    .precisions({
      ids: ['WAVES'].concat(txs.map((tx) => tx.assetId)),
    })
    .map((precisions) => {
      const feePrecision = precisions.splice(0, 1)[0];
      return txs.map((tx, idx) => ({
        ...tx,
        fee: tx.fee.dividedBy(10 ** feePrecision),
        amount: tx.amount.dividedBy(10 ** precisions[idx]),
      }));
    });
