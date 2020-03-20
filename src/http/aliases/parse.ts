import { Result, Ok as ok, Error as error } from 'folktale/result';
import { merge } from 'ramda';
import { ParseError } from '../../errorHandling';
import {
  AliasesServiceGetRequest,
  AliasesServiceMgetRequest,
  AliasesServiceSearchRequest,
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
  showBroken: parseBool,
});

type ParserFnType = typeof mgetOrSearchParser;

const isMgetRequest = (
  req: ParsedFilterValues<ParserFnType>
): req is AliasesServiceMgetRequest =>
  'aliases' in req && Array.isArray(req.aliases);

const isSearchRequest = (
  req: ParsedFilterValues<ParserFnType>
): req is AliasesServiceSearchRequest => typeof req.address !== 'undefined';

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

  return mgetOrSearchParser(query).chain(fValues => {
    if (isMgetRequest(fValues)) {
      return ok(fValues);
    } else {
      const fValuesWithDefaults = withDefaults(fValues);

      if (isSearchRequest(fValuesWithDefaults)) {
        return ok(
          merge({ showBroken: false, limit: LIMIT }, fValuesWithDefaults)
        );
      } else {
        return error(
          new ParseError(new Error('Address is incorrect or undefined'))
        );
      }
    }
  });
};
