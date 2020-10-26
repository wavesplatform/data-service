import { Result, Ok as ok, Error as error } from 'folktale/result';
import { mergeAll } from 'ramda';
import { ParseError } from '../../errorHandling';
import {
  AliasesServiceGetRequest,
  AliasesServiceMgetRequest,
  AliasesServiceSearchRequest,
  WithAddress,
  WithAddresses,
  WithQueries,
} from '../../services/aliases';
import commonFilters from '../_common/filters/filters';
import { parseFilterValues, withDefaults } from '../_common/filters';
import { HttpRequest } from '../_common/types';
import {
  parseArrayQuery,
  ParseArrayQuery,
} from '../../utils/parsers/parseArrayQuery';
import { parseBool } from '../../utils/parsers/parseBool';
import { ParsedFilterValues } from '../_common/filters/types';

const LIMIT = 1000;

const mgetOrSearchParser = parseFilterValues({
  aliases: parseArrayQuery as ParseArrayQuery, // merge function type and overloads
  address: commonFilters.query,
  addresses: parseArrayQuery as ParseArrayQuery,
  queries: parseArrayQuery as ParseArrayQuery,
  showBroken: parseBool,
});

type ParserFnType = typeof mgetOrSearchParser;

const isMgetRequest = (
  req: ParsedFilterValues<ParserFnType>
): req is AliasesServiceMgetRequest =>
  'aliases' in req && Array.isArray(req.aliases);

const isSearchWithAddressRequest = (
  req: ParsedFilterValues<ParserFnType>
): req is AliasesServiceSearchRequest & WithAddress =>
  typeof req.address === 'string';

const isSearchWithAddressesRequest = (
  req: ParsedFilterValues<ParserFnType>
): req is AliasesServiceSearchRequest & WithAddresses =>
  Array.isArray(req.addresses);

const isSearchWithQueriesRequest = (
  req: ParsedFilterValues<ParserFnType>
): req is AliasesServiceSearchRequest & WithQueries =>
  Array.isArray(req.queries);

export const get = ({
  params,
}: HttpRequest<['id']>): Result<ParseError, AliasesServiceGetRequest> => {
  if (params) {
    return ok({ id: params.id });
  } else {
    return error(new ParseError(new Error('AliasId is required')));
  }
};

export const mgetOrSearch = ({
  query,
}: HttpRequest): Result<
  ParseError,
  AliasesServiceMgetRequest | AliasesServiceSearchRequest
> => {
  if (!query) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return mgetOrSearchParser(query).chain((fValues) => {
    if (isMgetRequest(fValues)) {
      return ok(fValues);
    } else {
      let fValuesWithDefaults = withDefaults(fValues);
      fValuesWithDefaults = mergeAll<typeof fValuesWithDefaults>([
        { showBroken: false },
        fValuesWithDefaults,
        { limit: LIMIT },
      ]);

      if (isSearchWithAddressRequest(fValuesWithDefaults)) {
        if (!fValuesWithDefaults.address.length) {
          return error(
            new ParseError(new Error('`address` is not allowed to be empty'))
          );
        } else {
          return ok(fValuesWithDefaults);
        }
      } else if (isSearchWithAddressesRequest(fValuesWithDefaults)) {
        if (
          fValuesWithDefaults.addresses.filter((v) => v.length === 0).length > 0
        ) {
          return error(
            new ParseError(
              new Error('`addresses` is not allowed to be has an empty value')
            )
          );
        } else {
          return ok(fValuesWithDefaults);
        }
      } else if (isSearchWithQueriesRequest(fValuesWithDefaults)) {
        return ok(fValuesWithDefaults);
      } else {
        return error(
          new ParseError(
            new Error(
              'Neither `address` nor `addresses` nor `queries` were not provided'
            )
          )
        );
      }
    }
  });
};
