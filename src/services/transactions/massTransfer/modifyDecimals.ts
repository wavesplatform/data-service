import { Task } from 'folktale/concurrency/task';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { MassTransferTx } from './repo/types';

export const modifyDecimals = (assetsService: AssetsService) => (
  txs: MassTransferTx[]
): Task<AppError, MassTransferTx[]> =>
  assetsService
    .precisions({
      ids: ['WAVES'].concat(txs.map((tx) => tx.assetId)),
    })
    .map((precisions) => {
      const feePrecision = precisions.splice(0, 1)[0];
      return txs.map((tx, idx) => ({
        ...tx,
        fee: tx.fee.multipliedBy(10 ** -feePrecision),
        transfers: tx.transfers.map((tr) => ({
          ...tr,
          amount: tr.amount.multipliedBy(10 ** -precisions[idx]),
        })),
      }));
    });
