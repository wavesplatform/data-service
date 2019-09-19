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
    maybeResponses.map(response =>
      response.map(transformResult).matchWith({
        Just: ({ value }) => pair(value),
        Nothing: () => pair(),
      })
    ),
    request && {
      matcher: request.matcher,
    }
  );
