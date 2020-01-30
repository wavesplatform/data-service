import { Result, Ok as ok, Error as error } from 'folktale/result';
import { compose, reject, isNil, mapObjIndexed } from 'ramda';
import { ParseError } from '../../../errorHandling';
import commonFilters from './filters';
import { CommonFilters, Parser } from './types';

export const parseFilterValues = <
  Filters extends {
    [K: string]: Parser<any, any>;
  }
>(
  filters: Filters
) => <
  AllParsedFilterValues extends {
    [K in keyof Filters]: ReturnType<Filters[K]>;
  } &
    { [K in keyof CommonFilters]: ReturnType<CommonFilters[K]> },
  ParsedFilterValues extends {
    [K in keyof Filters]: Filters[K] extends Parser<infer R> ? R : never;
  } &
    {
      [K in keyof CommonFilters]: CommonFilters[K] extends Parser<infer R>
        ? R
        : never;
    }
>(
  values: Partial<
    { [K in keyof Filters]: Parameters<Filters[K]>[0] } &
      { [K in keyof CommonFilters]: Parameters<CommonFilters[K]>[0] }
  >
) =>
  compose<
    Filters | CommonFilters,
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
  )({ ...filters, ...commonFilters });
