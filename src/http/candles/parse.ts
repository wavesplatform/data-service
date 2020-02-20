import { Result, Error as error, Ok as ok } from 'folktale/result';
import { compose, defaultTo, isNil } from 'ramda';
import { ParseError } from '../../errorHandling';
import { CandlesSearchRequest } from '../../services/candles/repo';
import { parseFilterValues } from '../_common/filters';
import commonFilters from '../_common/filters/filters';
import { Parser } from '../_common/filters/types';
import { HttpRequest } from '../_common/types';

import { loadConfig } from '../../loadConfig';

const options = loadConfig();

const matcherParser: Parser<string> = compose<
  string | undefined,
  string,
  Result<ParseError, string>
>(
  commonFilters.query as Parser<string>, // raw always will be defined
  defaultTo(options.matcher.defaultMatcherAddress)
);

export const parse = ({
  params,
  query,
}: HttpRequest<['amountAsset', 'priceAsset']>): Result<
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
    matcher: matcherParser,
    interval: commonFilters.query,
  })(query).chain(fValues => {
    if (isNil(fValues.timeStart)) {
      return error(new ParseError(new Error('timeStart is required')));
    }

    if (isNil(fValues.interval)) {
      return error(new ParseError(new Error('interval is required')));
    }

    return ok({
      amountAsset: params.amountAsset,
      priceAsset: params.priceAsset,
      matcher: fValues.matcher,
      timeStart: fValues.timeStart,
      timeEnd: fValues.timeEnd || new Date(),
      interval: fValues.interval,
    });
  });
};
