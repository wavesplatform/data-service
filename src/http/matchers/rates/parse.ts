import { isNil } from 'ramda';
import { fromNullable } from 'folktale/maybe';
import { Result, Error as error, Ok as ok } from 'folktale/result';
import { ParseError } from '../../../errorHandling';
import { RateMgetParams } from '../../../types';
import { parseDate, parsePairs } from '../../../utils/parsers';
import { parseFilterValues } from '../../_common/filters';
import { HttpRequest } from '../../_common/types';

export const parse = ({
  params,
  query,
}: HttpRequest<['matcher']>): Result<ParseError, RateMgetParams> => {
  if (isNil(params)) {
    return error(new ParseError(new Error('Params is empty')));
  }
  if (isNil(query)) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return parseFilterValues({
    pairs: parsePairs,
    timestamp: parseDate,
  })(query).chain(fValues => {
    if (isNil(fValues.pairs)) {
      return error(
        new ParseError(new Error('Pairs are incorrect or are not set'))
      );
    }

    return ok({
      matcher: params.matcher,
      pairs: fValues.pairs,
      timestamp: fromNullable(fValues.timestamp),
    });
  });
};
