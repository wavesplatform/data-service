import { Task } from 'folktale/concurrency/task';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { withDecimals } from '../_common/withDecimals';
import { MassTransferTx } from './repo/types';

export const modifyDecimals = (assetsService: AssetsService) => (
  txs: MassTransferTx[]
): Task<AppError, MassTransferTx[]> =>
  withDecimals(
    assetsService,
    txs
      .map((tx) =>
        [
          {
            value: tx.fee,
            assetId: 'WAVES',
          },
        ].concat(
          tx.transfers.map((tr) => ({
            value: tr.amount,
            assetId: tx.assetId,
          }))
        )
      )
      .reduce((acc, cur) => acc.concat(cur), [])
  ).map((v) =>
    txs.map((tx) => {
      let currentTxValues = v.splice(0, 1 + tx.transfers.length);
      return {
        ...tx,
        fee: currentTxValues[0],
        transfers: tx.transfers.map((tr, idx) => ({
          ...tr,
          amount: currentTxValues[idx + 1],
        })),
      };
    })
  );
