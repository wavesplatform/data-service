import { Result, Error as error, Ok as ok } from 'folktale/result';
import { isNil, mergeAll } from 'ramda';

import { ParseError } from '../../../errorHandling';
import { CandlesSearchRequest } from '../../../services/candles/repo';
import { interval as intervalFromString } from '../../../types/interval';
import { parseFilterValues, withDefaults } from '../../_common/filters';
import { HttpRequest } from '../../_common/types';
import { CandleIntervals, MAX_CANDLES_COUNT, parseInterval } from '../../candles/parse';

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

  const minInterval = intervalFromString('1m').unsafeGet();
  const maxInterval = intervalFromString('1M').unsafeGet();

  return parseFilterValues({
    interval: parseInterval({
      min: minInterval,
      max: maxInterval,
      divisibleBy: minInterval,
      allowed: CandleIntervals,
    }),
  })(query).chain((fValues) => {
    const fValuesWithDefaults = mergeAll<CandlesSearchRequest>([
      {
        timeEnd: new Date(),
      },
      withDefaults(fValues),
    ]);

    if (isNil(fValuesWithDefaults.timeStart)) {
      return error(new ParseError(new Error('timeStart is undefined')));
    }

    if (isNil(fValuesWithDefaults.interval)) {
      return error(new ParseError(new Error('interval is undefined')));
    }

    const periodLength =
      fValuesWithDefaults.timeEnd.getTime() - fValuesWithDefaults.timeStart.getTime();
    const expectedCandlesCount = Math.ceil(
      periodLength / fValuesWithDefaults.interval.length
    );
    if (expectedCandlesCount > MAX_CANDLES_COUNT) {
      return error(
        new ParseError(
          new Error(
            `${expectedCandlesCount} of candles is more then allowed of ${MAX_CANDLES_COUNT}. Try to decrease requested period of time.`
          )
        )
      );
    }

    return ok({
      amountAsset: params.amountAsset,
      priceAsset: params.priceAsset,
      matcher: params.matcher,
      timeStart: fValuesWithDefaults.timeStart,
      timeEnd: fValuesWithDefaults.timeEnd,
      interval: fValuesWithDefaults.interval,
    });
  });
};
