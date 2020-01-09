import { isNil } from 'ramda';
import * as maybe from 'folktale/maybe';
import { Result, Error as error } from 'folktale/result';
import { ParseError } from '../../../errorHandling';
import { RateMgetParams } from '../../../types';
import { parseDate } from '../../../utils/parseDate';
import { parseFilterValues } from '../../_common/filters';
import { HttpRequest } from '../../_common/types';
import { parsePairs } from '../../utils/parsePairs';

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
  })(query).map(fValues => {
    if (isNil(fValues.pairs)) {
      throw new ParseError(new Error('Pairs are incorrect or are not set'));
    }

    return {
      matcher: params.matcher,
      pairs: fValues.pairs,
      timestamp: maybe.fromNullable(fValues.timestamp),
    };
  });
};
