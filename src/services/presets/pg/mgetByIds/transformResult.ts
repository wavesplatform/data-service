import { list, List } from '../../../../types';
import { Maybe } from 'folktale/maybe';
import { NamedType } from 'types/createNamedType';

export type DataType<T extends NamedType<string, any>> = T extends NamedType<
  string,
  infer R
>
  ? R
  : never;

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
