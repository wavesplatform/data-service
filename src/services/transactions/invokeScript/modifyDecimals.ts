import { Task } from 'folktale/concurrency/task';
import { defaultTo } from 'ramda';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { InvokeScriptTx } from './repo/types';

export const modifyDecimals = (assetsService: AssetsService) => (
  txs: InvokeScriptTx[]
): Task<AppError, InvokeScriptTx[]> =>
  assetsService
    .precisions({
      ids: txs
        .map((tx) =>
          [defaultTo('WAVES', tx.feeAsset)].concat(
            tx.payment.map((p) => p.assetId)
          )
        )
        .reduce((acc, cur) => acc.concat(cur), []),
    })
    .map((precisions) =>
      txs.map((tx) => {
        let currentTxValues = precisions.splice(0, 1 + tx.payment.length);
        return {
          ...tx,
          fee: tx.fee.dividedBy(10 ** currentTxValues[0]),
          payment: tx.payment.map((p, idx) => ({
            ...p,
            amount: p.amount.dividedBy(10 ** currentTxValues[idx + 1]),
          })),
        };
      })
    );
