import { Task } from 'folktale/concurrency/task';
import { zipWith } from 'ramda';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { ReissueTx } from './repo/types';

export const modifyDecimals = (assetsService: AssetsService) => (
  txs: ReissueTx[]
): Task<AppError, ReissueTx[]> =>
  assetsService
    .precisions({
      ids: ['WAVES'].concat(txs.map((tx) => tx.assetId)),
    })
    .map((precisions) => {
      const feePrecision = precisions.splice(0, 1)[0];
      return zipWith(
        (tx, assetPrecision) => ({
          ...tx,
          fee: tx.fee.dividedBy(10 ** feePrecision),
          quantity: tx.quantity.dividedBy(10 ** assetPrecision),
        }),
        txs,
        precisions
      );
    });
