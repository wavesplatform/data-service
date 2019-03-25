import { Result, Ok as ok, Error as error } from 'folktale/result';
import { ValidationError } from '../errorHandling';
import { findLastIndex, values } from 'ramda';
import { Interval, units, parseUnit } from '../types/interval';

export const div = (a: Interval, b: Interval): number => a.length / b.length;

/** fromMillisecs :: number -> Result<ValidationError, Interval>  */
export const fromMillisecs = (
  millisecs: number
): Result<ValidationError, Interval> => {
  const secs = millisecs / 1000;

  const unitsValues = values(units);
  let unitIndex = findLastIndex((x: number) => x >= secs && secs % x == 0)(
    unitsValues
  );

  // 'Second' unit is by default
  if (!~unitIndex) {
    unitIndex = 0;
  }

  return parseUnit(Object.keys(units)[unitIndex]).matchWith({
    Ok: ({ value: unit }) => {
      const length = secs / units[unit];
      // whether length is integer
      if (length % 1 === 0) {
        return ok({
          length: millisecs,
          unit,
          source: `${length}${unit}`,
        });
      } else {
        return error(
          new ValidationError('Provided millisecs number is not a valid number')
        );
      }
    },
    Error: ({ value: e }) => error(e),
  });
};
