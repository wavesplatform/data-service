import { Maybe } from 'folktale/maybe';

import { list, List, Pair, pair } from '../../types';
import { PairDbResponse } from './transformResult';

import { transformResult } from './transformResult';

export const transformResults = (
  maybeResponses: Maybe<PairDbResponse>[]
): List<Pair> =>
  list(
    maybeResponses.map(response =>
      response.matchWith({
        Just: ({ value }) =>
          pair(transformResult(value), {
            amountAsset: value.amount_asset_id,
            priceAsset: value.price_asset_id,
          }),
        Nothing: () => pair(null, null),
      })
    )
  );
