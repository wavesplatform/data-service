import { findLast } from 'ramda';
import { Result, Ok as ok, Error as error } from 'folktale/result';
import { Interval } from '../../../types';
import { div } from '../../../utils/interval';
import { ValidationError } from '../../../errorHandling';

export const highestDividerLessThan = (
  inter: Interval,
  dividers: Interval[]
): Result<ValidationError, Interval> => {
  const i = findLast((i: Interval) => div(inter, i) >= 1, dividers);
  return i ? ok(i) : error(new ValidationError('Divider not found'));
};

/**
 * Composes sum using a polynom with additives from given units array
 * Uses a greedy algorithm
 * @param units is sorted desc
 * @param sum
 */
export const numberToUnitsPolynom = (
  units: number[],
  sum: number
): number[][] => {
  const [, result] = units.reduce<[number, number[][]]>(
    ([remaining, result], unit) => {
      const k = Math.floor(remaining / unit);
      if (k > 0) {
        return [remaining - k * unit, [...result, [unit, k]]];
      } else {
        return [remaining, result];
      }
    },
    [sum, []]
  );

  return result;
};
