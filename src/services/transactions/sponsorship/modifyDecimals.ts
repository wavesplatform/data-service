import { Task } from 'folktale/concurrency/task';
import { compose, isNil } from 'ramda';
import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';
import { Amount, withDecimals } from '../_common/withDecimals';
import { SponsorshipTx } from './repo/types';

export const modifyDecimals = (assetsService: AssetsService) => (
  txs: SponsorshipTx[]
): Task<AppError, SponsorshipTx[]> =>
  withDecimals(
    assetsService,
    txs
      .map((tx) =>
        compose((a: Array<Amount>) =>
          isNil(tx.minSponsoredAssetFee)
            ? a
            : a.concat({
                value: tx.minSponsoredAssetFee,
                assetId: tx.assetId,
              })
        )([
          {
            value: tx.fee,
            assetId: 'WAVES',
          },
        ])
      )
      .reduce((acc, cur) => acc.concat(cur), [])
  ).map((v) =>
    txs.map((tx) => {
      let currentTxValues = v.splice(0, isNil(tx.minSponsoredAssetFee) ? 1 : 2);
      return {
        ...tx,
        fee: currentTxValues[0],
        minSponsoredAssetFee: isNil(tx.minSponsoredAssetFee)
          ? null
          : currentTxValues[1],
      };
    })
  );
