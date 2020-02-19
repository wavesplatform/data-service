import { Result, Ok as ok, Error as error } from 'folktale/result';
import { ParseError } from '../../errorHandling';
import {
  AliasesServiceGetRequest,
  AliasesServiceMgetRequest,
  AliasesServiceSearchRequest,
} from '../../services/aliases';
import commonFilters from '../_common/filters/filters';
import { parseFilterValues } from '../_common/filters';
import { HttpRequest } from '../_common/types';
import {
  parseArrayQuery,
  ParseArrayQuery,
} from '../../utils/parsers/parseArrayQuery';
import { parseBool } from '../../utils/parsers/parseBool';

const LIMIT = 1000;

export const isMgetRequest = (req: any): req is AliasesServiceMgetRequest =>
  'aliases' in req && Array.isArray(req.aliases);

export const get = ({
  params,
}: HttpRequest<['id']>): Result<ParseError, AliasesServiceGetRequest> => {
  if (params) {
    return ok({ id: params.id });
  } else {
    return error(new ParseError(new Error('AliasId is not set')));
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

  return parseFilterValues({
    aliases: parseArrayQuery as ParseArrayQuery, // merge function type and overloads 
    address: commonFilters.query,
    showBroken: parseBool,
  })(query).chain(fValues => {
    if (isMgetRequest(fValues)) {
      return ok(fValues);
    } else {
      if (!('address' in fValues) || typeof fValues.address === 'undefined') {
        return error(
          new ParseError(new Error('Address is incorrect or undefined'))
        );
      }

      return ok({
        address: fValues.address,
        showBroken: fValues.showBroken || false,
        after: fValues.after,
        sort: fValues.sort,
        limit: LIMIT,
      });
    }
  });
};
