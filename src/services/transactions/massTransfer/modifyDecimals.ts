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
    .map((precisions) =>
      txs.map((tx) => {
        const feePrecision = precisions.splice(0, 1)[0];
        return {
          ...tx,
          fee: tx.fee.dividedBy(10 ** feePrecision),
          transfers: tx.transfers.map((tr, idx) => ({
            ...tr,
            amount: tr.amount.dividedBy(10 ** precisions[idx + 1]),
          })),
        };
      })
    );
