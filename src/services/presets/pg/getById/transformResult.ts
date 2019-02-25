import { Maybe } from 'folktale/maybe';
import { NamedType } from 'types/createNamedType';

const dataOrNull = <ResponseTransformed, T = any>(
  typeFactory: (d?: T) => ResponseTransformed
) => (maybe: Maybe<T>) =>
  maybe.matchWith({
    Just: ({ value }) => typeFactory(value),
    Nothing: () => typeFactory(),
  });

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
  maybeResponse: Maybe<ResponseRaw>,
  request?: Request
): ResponseTransformed =>
  dataOrNull(typeFactory)(maybeResponse.map(transformDbResponse));
