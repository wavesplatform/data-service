import { Ok as ok } from 'folktale/result';
import { compose, isNil, split } from 'ramda';
import { AssetIdsPair } from '../../types';
import { Parser } from '../../http/_common/filters/types';
import { parseArrayQuery } from './parseArrayQuery';

export type ParsePairs = Parser<AssetIdsPair[] | undefined>;

export const parsePairs: ParsePairs = (pairsRaw?: string) =>
  isNil(pairsRaw)
    ? ok(undefined)
    : parseArrayQuery(pairsRaw).map(pairs =>
        pairs.map(
          compose(
            ([amountAsset, priceAsset]) => ({ amountAsset, priceAsset }),
            split('/')
          )
        )
      );
