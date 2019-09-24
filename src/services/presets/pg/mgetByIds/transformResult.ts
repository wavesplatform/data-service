import { Maybe } from 'folktale/maybe';

import { list, List, Serializable } from '../../../../types';

export const transformResults = <
  Request,
  ResponseRaw,
  ResponseTransformed,
  Result extends Serializable<any, ResponseTransformed | null>
>(
  typeFactory: (d?: ResponseTransformed) => Result
) => (
  transformDbResponse: (
    results: ResponseRaw,
    request?: Request
  ) => ResponseTransformed
) => (maybeResponses: Maybe<ResponseRaw>[], request?: Request): List<Result> =>
  list(
    maybeResponses.map(maybeResponse =>
      maybeResponse
        .map(res => transformDbResponse(res, request))
        .matchWith({
          Just: ({ value }) => typeFactory(value),
          Nothing: () => typeFactory(),
        })
    )
  );
