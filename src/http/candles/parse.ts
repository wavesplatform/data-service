import { Result, Error as error, Ok as ok } from 'folktale/result';
import { isNil, mergeAll } from 'ramda';
import { ParseError } from '../../errorHandling';
import { WithMatcher } from '../../services/_common';
import { CandlesSearchRequest } from '../../services/candles/repo';
import { loadConfig } from '../../loadConfig';
import { parseFilterValues, withDefaults } from '../_common/filters';
import commonFilters from '../_common/filters/filters';
import { HttpRequest } from '../_common/types';
import { withMatcher } from '../_common/utils';

const config = loadConfig();

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
    matcher: commonFilters.query,
    interval: commonFilters.query,
  })(query).chain((fValues) => {
    const fValuesWithDefaults = mergeAll<CandlesSearchRequest & WithMatcher>([
      {
        matcher: config.matcher.defaultMatcherAddress,
      },
      withDefaults(fValues),
    ]);

    if (!withMatcher(fValuesWithDefaults)) {
      return error(new ParseError(new Error('Matcher is not defined')));
    }

    if (isNil(fValuesWithDefaults.timeStart)) {
      return error(new ParseError(new Error('timeStart is required')));
    }

    if (isNil(fValuesWithDefaults.interval)) {
      return error(new ParseError(new Error('interval is required')));
    }

    if (isNil(fValuesWithDefaults.matcher)) {
      return error(new ParseError(new Error('matcher is required')));
    }

    return ok({
      amountAsset: params.amountAsset,
      priceAsset: params.priceAsset,
      matcher: fValuesWithDefaults.matcher,
      timeStart: fValuesWithDefaults.timeStart,
      timeEnd: fValuesWithDefaults.timeEnd || new Date(),
      interval: fValuesWithDefaults.interval,
    });
  });
};
