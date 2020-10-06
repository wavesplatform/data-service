import { BigNumber } from '@waves/data-entities';
import {
  of as taskOf,
  rejected,
  Task,
  waitAll,
} from 'folktale/concurrency/task';

import { AppError } from '../../../errorHandling';
import { AssetsService } from '../../assets';

export type Amount = {
  value: BigNumber;
  assetId: string;
};

export const withDecimals = (
  assetsService: AssetsService,
  values: Amount[]
): Task<AppError, BigNumber[]> =>
  assetsService
    .mget({
      ids: values.map((v) => v.assetId),
    })
    .chain((ms) =>
      waitAll<AppError, BigNumber>(
        ms.map((ma, idx) =>
          ma.matchWith({
            Just: ({ value: a }) =>
              taskOf(values[idx].value.dividedBy(Math.pow(10, a.precision))),
            Nothing: () =>
              rejected(
                AppError.Resolver(
                  `Asset ${values[idx].assetId} for decimals calculation not found.`
                )
              ),
          })
        )
      )
    );
