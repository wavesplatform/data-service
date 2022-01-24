import { Result, Error as error, Ok as ok } from 'folktale/result';
import { isNil, mergeAll } from 'ramda';
import { isJoiError, ParseError, ValidationError } from '../../errorHandling';
import { WithMatcher } from '../../services/_common';
import { CandlesSearchRequest } from '../../services/candles/repo';
import { loadConfig } from '../../loadConfig';
import { parseFilterValues, withDefaults } from '../_common/filters';
import commonFilters from '../_common/filters/filters';
import { HttpRequest } from '../_common/types';
import { withMatcher } from '../_common/utils';
import { Interval, interval as intervalFromString } from '../../types/interval';
import { div } from '../../utils/interval';
import { CandleInterval } from '../../types';

const config = loadConfig();

export const MAX_CANDLES_COUNT = 1440;

export const CandleIntervals = [
  CandleInterval.Month1,
  CandleInterval.Week1,
  CandleInterval.Day1,
  CandleInterval.Hour12,
  CandleInterval.Hour6,
  CandleInterval.Hour4,
  CandleInterval.Hour3,
  CandleInterval.Hour2,
  CandleInterval.Hour1,
  CandleInterval.Minute30,
  CandleInterval.Minute15,
  CandleInterval.Minute5,
  CandleInterval.Minute1,
];

type ParseIntervalOptions = {
  min: Interval;
  max: Interval;
  divisibleBy: Interval;
  allowed: CandleInterval[];
};

export const parseInterval =
  ({ min, max, divisibleBy, allowed }: ParseIntervalOptions) =>
  (v: string | undefined): Result<ParseError, Interval | undefined> =>
    commonFilters.query(v).chain((s: string | undefined) => {
      if (isNil(s)) return ok(s);
      else {
        return intervalFromString(s)
          .chain((i: Interval) => {
            if (i.length < min.length) {
              return error<ValidationError, Interval>(
                new ValidationError(`Provided interval is smaller then minimum allowed`, {
                  allowed: min.source,
                  actual: i.source,
                })
              );
            }

            if (i.length > max.length) {
              return error<ValidationError, Interval>(
                new ValidationError(`Provided interval is bigger then maximum allowed`, {
                  allowed: max.source,
                  actual: i.source,
                })
              );
            }

            const d = div(i, divisibleBy);
            if (d % 1 > 0) {
              return error<ValidationError, Interval>(
                new ValidationError(`Interval must be divisible by ${divisibleBy.source}`)
              );
            }

            if (
              Array.isArray(allowed) &&
              allowed.length > 0 &&
              isNil(allowed.find((candleInterval) => candleInterval == i.source))
            ) {
              return error<ValidationError, Interval>(
                new ValidationError('Interval must be one of the allowed', {
                  allowed,
                  actual: i.source,
                })
              );
            }

            return ok<ValidationError, Interval>(i);
          })
          .mapError((e) => {
            return isJoiError(e.meta)
              ? new ParseError(e.error)
              : new ParseError(e.error, e.meta);
          });
      }
    });

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

  const minInterval = intervalFromString('1m').unsafeGet();
  const maxInterval = intervalFromString('1M').unsafeGet();

  return parseFilterValues({
    matcher: commonFilters.query,
    interval: parseInterval({
      min: minInterval,
      max: maxInterval,
      divisibleBy: minInterval,
      allowed: CandleIntervals,
    }),
  })(query).chain((fValues) => {
    const fValuesWithDefaults = mergeAll<CandlesSearchRequest & WithMatcher>([
      {
        matcher: config.matcher.defaultMatcherAddress,
        timeEnd: new Date(),
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
      matcher: fValuesWithDefaults.matcher,
      timeStart: fValuesWithDefaults.timeStart,
      timeEnd: fValuesWithDefaults.timeEnd,
      interval: fValuesWithDefaults.interval,
    });
  });
};
