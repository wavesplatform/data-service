import { Result, Error as error } from 'folktale/result';
import { isNil } from 'ramda';
import { ParseError } from '../../../errorHandling';
import { CandlesSearchRequest } from '../../../services/candles/repo';
import { parseFilterValues } from '../../_common/filters';
import commonParsers from '../../_common/filters/parsers';
import { HttpRequest } from '../../_common/types';

export const parse = ({
  params,
  query,
}: HttpRequest<['matcher', 'amountAsset', 'priceAsset']>): Result<
  ParseError,
  CandlesSearchRequest
> => {
  if (isNil(params)) {
    return error(new ParseError(new Error('Params is empty')));
  }

  if (isNil(query)) {
    return error(new ParseError(new Error('Query is empty')));
  }

  return parseFilterValues({
    interval: commonParsers.query,
  })(query).map(fValues => {
    if (isNil(fValues.timeStart)) {
      throw new ParseError(new Error('timeStart is undefined'));
    }

    if (isNil(fValues.interval)) {
      throw new ParseError(new Error('interval is undefined'));
    }

    return {
      amountAsset: params.amountAsset,
      priceAsset: params.priceAsset,
      matcher: params.matcher,
      timeStart: fValues.timeStart,
      timeEnd: fValues.timeEnd || new Date(),
      interval: fValues.interval,
    };
  });
};
