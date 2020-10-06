import { Task } from 'folktale/concurrency/task';
import { defaultTo } from 'ramda';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { withDecimals } from '../_common/withDecimals';
import { InvokeScriptTx } from './repo/types';

export const modifyDecimals = (assetsService: AssetsService) => (
  txs: InvokeScriptTx[]
): Task<AppError, InvokeScriptTx[]> =>
  withDecimals(
    assetsService,
    txs
      .map((tx) =>
        [
          {
            value: tx.fee,
            assetId: defaultTo('WAVES', tx.feeAsset),
          },
        ].concat(
          tx.payment.map((p) => ({
            value: p.amount,
            assetId: p.assetId,
          }))
        )
      )
      .reduce((acc, cur) => acc.concat(cur), [])
  ).map((v) =>
    txs.map((tx) => {
      let currentTxValues = v.splice(0, 1 + tx.payment.length);
      return {
        ...tx,
        fee: currentTxValues[0],
        payment: tx.payment.map((p, idx) => ({
          ...p,
          amount: currentTxValues[idx + 1],
        })),
      };
    })
  );
