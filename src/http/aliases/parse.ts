import { isNil } from 'ramda';
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
import { parseArrayQuery } from '../../utils/parsers/parseArrayQuery';
import { parseBool } from '../../utils/parsers/parseBool';

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
    aliases: parseArrayQuery,
    address: commonFilters.query,
    showBroken: parseBool,
  })(query).map(fValues => {
    if (Array.isArray(fValues.aliases)) {
      return { ids: fValues.aliases };
    } else {
      if (isNil(fValues.address)) {
        throw new ParseError(new Error('Address is incorrect or undefined'));
      }

      return {
        address: fValues.address,
        showBroken: fValues.showBroken,
        sort: fValues.sort,
        limit: fValues.limit,
      };
    }
  });
};
