import { Maybe } from 'folktale/maybe';

export const transformResults = <Id, ResponseRaw, ResponseTransformed>(
  transformDbResponse: (
    results: ResponseRaw,
    request?: Id
  ) => ResponseTransformed
) => (
  maybeResponse: Maybe<ResponseRaw>,
  request?: Id
): Maybe<ResponseTransformed> => maybeResponse.map(transformDbResponse);
