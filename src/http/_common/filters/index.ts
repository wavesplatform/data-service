import { Result, Ok as ok, Error as error } from 'folktale/result';
import { compose, reject, isNil, mapObjIndexed } from 'ramda';
import { ParseError } from '../../../errorHandling';
import commonParsers from './parsers';
import { CommonParsers, Parser } from './types';

export const parseFilterValues = <
  Parsers extends {
    [K: string]: Parser<any, any>;
  }
>(
  parsers: Parsers
) => <
  AllParsedFilterValues extends {
    [K in keyof Parsers]: ReturnType<Parsers[K]>;
  } &
    { [K in keyof CommonParsers]: ReturnType<CommonParsers[K]> },
  ParsedFilterValues extends {
    [K in keyof Parsers]: Parsers[K] extends Parser<infer R> ? R : never;
  } &
    {
      [K in keyof CommonParsers]: CommonParsers[K] extends Parser<infer R>
        ? R
        : never;
    }
>(
  values: Partial<
    { [K in keyof Parsers]: Parameters<Parsers[K]>[0] } &
      { [K in keyof CommonParsers]: Parameters<CommonParsers[K]>[0] }
  >
) =>
  compose<
    Parsers | CommonParsers,
    AllParsedFilterValues,
    Result<ParseError, ParsedFilterValues>,
    Result<ParseError, ParsedFilterValues>
  >(
    r => r.map(reject(isNil)),
    d =>
      Object.keys(d).reduce(
        (acc, cur) =>
          acc.chain(a =>
            d[cur].matchWith({
              Ok: ({ value }) => ok({ ...a, [cur]: value }),
              Error: ({ value }) => error(value),
            })
          ),
        ok<ParseError, ParsedFilterValues>({} as ParsedFilterValues)
      ),
    mapObjIndexed<
      Parser<ParsedFilterValues[keyof ParsedFilterValues]>,
      ReturnType<Parser<ParsedFilterValues[keyof ParsedFilterValues]>>,
      AllParsedFilterValues
    >((val, key) => val(values[key]))
  )({ ...parsers, ...commonParsers });
