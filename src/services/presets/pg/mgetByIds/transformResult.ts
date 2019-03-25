import { Maybe } from 'folktale/maybe';

import { list, List, FromSerializable, Serializable } from '../../../../types';

export const transformResults = <
  Request,
  ResponseRaw,
  ResponseTransformed extends Serializable<string, any>
>(
  typeFactory: (
    d?: FromSerializable<ResponseTransformed>
  ) => ResponseTransformed
) => (
  transformDbResponse: (
    results: ResponseRaw,
    request?: Request
  ) => FromSerializable<ResponseTransformed>
) => (
  maybeResponses: Maybe<ResponseRaw>[],
  request?: Request
): List<ResponseTransformed> =>
  list(
    maybeResponses.map(response =>
      response
        .map(res => transformDbResponse(res, request))
        .matchWith({
          Just: ({ value }) => typeFactory(value),
          Nothing: () => typeFactory(),
        })
    )
  );
