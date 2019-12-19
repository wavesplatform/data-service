import { compose, reject, isNil, mapObjIndexed } from 'ramda';

type Parsers = Record<string, (v: string) => any>;

export const parseFilterValues = (parsers: Parsers) => (
  values: Record<string, string>
) =>
  compose(
    reject(isNil),
    mapObjIndexed((val: (arg0: string) => unknown, key: string | number) =>
      val(values[key])
    )
  )(parsers);
