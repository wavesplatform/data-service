import { Result, Error as error } from 'folktale/result';
import { omit } from 'ramda';
import { ParseError } from '../../errorHandling';
import { ServiceMgetRequest } from '../../types';
import { parseFilterValues } from '../_common/filters';
import commonFilters from '../_common/filters/filters';
import { HttpRequest } from '../_common/types';
import { isMgetRequest } from './_common';
import { GenesisTxsServiceSearchRequest } from '../../services/transactions/genesis';

export const parseGenesisMgetOrSearch = ({
  query,
}: HttpRequest<string[]>): Result<
  ParseError,
  ServiceMgetRequest | GenesisTxsServiceSearchRequest
> => {
  if (!query) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return parseFilterValues({
    recipient: commonFilters.query,
  })(query).map(fValues => {
    if (isMgetRequest(fValues)) {
      return fValues;
    } else {
      return omit(['sender'], fValues);
    }
  });
};
