import { Maybe } from 'folktale/maybe';

import { list, List, Pair, pair } from '../../types';
import { MgetRequest } from './types';
import { PairDbResponse } from './transformResult';

import { transformResult } from './transformResult';

export const transformResults = (
  maybeResponses: Maybe<PairDbResponse>[],
  request?: MgetRequest
): List<Pair> =>
  list(
    maybeResponses.map(response => response.map(
      dbResp => pair(transformResult(dbResp), {
        priceAsset: dbResp.price_asset_id, amountAsset: dbResp.amount_asset_id
      })).getOrElse(
        pair(null, null)
      )),
    request && {
      matcher: request.matcher,
    }
  );
