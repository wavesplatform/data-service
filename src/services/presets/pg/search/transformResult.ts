import { FromSerializable, list, List, Serializable } from '../../../../types';

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
) => (responses: ResponseRaw[], request?: Request): List<ResponseTransformed> =>
  list(
    responses.map(response =>
      typeFactory(transformDbResponse(response, request))
    )
  );
