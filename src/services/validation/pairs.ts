import { PairOrderingService } from '../PairOrderingService';
import { AssetIdsPair, ServiceMget, Asset } from '../../types';
import {
  Task,
  rejected as taskRejected,
  of as taskOf,
} from 'folktale/concurrency/task';
import { ValidationError, AppError } from '../../errorHandling/index';
import { zip } from 'ramda';

export const validatePairs = (
  assetsMget: ServiceMget<string[], Asset>,
  pairOrderingService: PairOrderingService
) => (matcher: string, pairs: AssetIdsPair[]): Task<AppError, void> => {
  // correct order
  const incorrectPairs = pairs.filter(
    p =>
      !pairOrderingService.isCorrectOrder(matcher, p).matchWith({
        Just: ({ value }) => value,
        Nothing: () => true,
      })
  );

  if (incorrectPairs.length)
    return taskRejected(
      new ValidationError('Wrong assets order in provided pair(s)', {
        pairs: incorrectPairs,
      })
    );

  // all assets exist
  const assetIdsSet: Set<string> = new Set();
  pairs.forEach(p => {
    assetIdsSet.add(p.amountAsset);
    assetIdsSet.add(p.priceAsset);
  });
  const assetIds = Array.from(assetIdsSet);

  return assetsMget.mget(assetIds).chain(assets => {
    const nonExistingIds = zip(assetIds, assets.data)
      .filter(x => x[1].data === null)
      .map(x => x[0]);

    if (!nonExistingIds.length) {
      return taskOf(undefined);
    } else {
      return taskRejected(
        new ValidationError('Assets do not exist in the blockchain', {
          assets: nonExistingIds,
        })
      );
    }
  });
};
