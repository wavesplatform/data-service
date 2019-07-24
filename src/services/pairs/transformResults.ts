import { Maybe } from 'folktale/maybe';

import { list, List, Serializable } from '../../types';
import { MgetRequest } from './types';

export const transformResults = <
  Request extends MgetRequest,
  ResponseRaw,
  ResponseTransformed,
  Result extends Serializable<string, any>
>(
  typeFactory: (d?: ResponseTransformed) => Result
) => (
  transformDbResponse: (
    results: ResponseRaw,
    request?: Request
  ) => ResponseTransformed
) => (maybeResponses: Maybe<ResponseRaw>[], request?: Request): List<Result> =>
  list(
    maybeResponses.map(response =>
      response
        .map(res => transformDbResponse(res, request))
        .matchWith({
          Just: ({ value }) => typeFactory(value),
          Nothing: () => typeFactory(),
        })
    ),
    request && {
      matcher: request.matcher,
    }
  );
