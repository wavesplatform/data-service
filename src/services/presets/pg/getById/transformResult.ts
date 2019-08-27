import { Maybe } from 'folktale/maybe';

import { Serializable } from '../../../../types';

export const transformResults = <
  Id,
  ResponseRaw,
  ResponseTransformed,
  Result extends Serializable<string, any>
>(
  typeFactory: (d: ResponseTransformed) => Result
) => (
  transformDbResponse: (
    results: ResponseRaw,
    request?: Id
  ) => ResponseTransformed
) => (maybeResponse: Maybe<ResponseRaw>, request?: Id): Maybe<Result> =>
  maybeResponse.map(transformDbResponse).map(typeFactory);
