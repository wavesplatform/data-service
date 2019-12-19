import { Maybe } from 'folktale/maybe';

export const transformResults = <Request, ResponseRaw, ResponseTransformed>(
  transformDbResponse: (
    results: ResponseRaw,
    request?: Request
  ) => ResponseTransformed
) => (
  maybeResponses: Maybe<ResponseRaw>[],
  request?: Request
): (ResponseTransformed | null)[] =>
  maybeResponses.map(maybeResponse =>
    maybeResponse
      .map(res => transformDbResponse(res, request))
      .matchWith({
        Just: ({ value }) => value,
        Nothing: () => null,
      })
  );
