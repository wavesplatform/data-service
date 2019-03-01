import { list, List } from '../../../../types';
import { NamedType } from 'types/createNamedType';
import { DataType } from '../../types';

export const transformResults = <
  Request,
  ResponseRaw,
  ResponseTransformed extends NamedType<string, any>
>(
  typeFactory: (d?: DataType<ResponseTransformed>) => ResponseTransformed
) => (
  transformDbResponse: (
    results: ResponseRaw,
    request?: Request
  ) => DataType<ResponseTransformed>
) => (
  maybeResponses: ResponseRaw[],
  request?: Request
): List<ResponseTransformed> =>
  list(
    maybeResponses.map(response =>
      typeFactory(transformDbResponse(response, request))
    )
  );
