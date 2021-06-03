import { Task } from 'folktale/concurrency/task';
import { defaultTo, zipWith, splitEvery } from 'ramda';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { TransferTx } from './repo/types';

export const modifyDecimals = (assetsService: AssetsService) => (
  txs: TransferTx[]
): Task<AppError, TransferTx[]> =>
  assetsService
    .precisions({
      ids: txs
        .map((tx) => [defaultTo('WAVES', tx.feeAsset), tx.assetId])
        .reduce((acc, cur) => acc.concat(cur), []),
    })
    .map((v) =>
      zipWith(
        (tx, [feeAssetPrecision, assetPrecision]) => ({
          ...tx,
          fee: tx.fee.multipliedBy(10 ** -feeAssetPrecision),
          amount: tx.amount.multipliedBy(10 ** -assetPrecision),
        }),
        txs,
        splitEvery(v.length / txs.length, v)
      )
    );
