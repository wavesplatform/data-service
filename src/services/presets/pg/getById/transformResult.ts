import { Maybe } from 'folktale/maybe';
import { NamedType } from 'types/createNamedType';

export type DataType<T extends NamedType<string, any>> = T extends NamedType<
  string,
  infer R
>
  ? R
  : never;

export const transformResults = <
  Id,
  ResponseRaw,
  ResponseTransformed extends NamedType<string, any>
>(
  typeFactory: (d?: DataType<ResponseTransformed>) => ResponseTransformed
) => (
  transformDbResponse: (
    results: ResponseRaw,
    request?: Id
  ) => DataType<ResponseTransformed>
) => (maybeResponse: Maybe<ResponseRaw>, request?: Id): ResponseTransformed =>
  maybeResponse.map(transformDbResponse).matchWith({
    Just: ({ value }) => typeFactory(value),
    Nothing: () => typeFactory(),
  });
