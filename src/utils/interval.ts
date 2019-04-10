import { Result, Ok as ok, Error as error } from 'folktale/result';
import { ValidationError } from '../errorHandling';
import { compose, findLastIndex, reverse, values } from 'ramda';
import { Interval, interval, units, parseUnit } from '../types/interval';

export const div = (a: Interval, b: Interval): number => a.length / b.length;

export const fromMilliseconds = (
  milliseconds: number
): Result<ValidationError, Interval> => {
  const secs = milliseconds / 1000;

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
          length: milliseconds,
          unit,
          source: `${length}${unit}`,
        });
      } else {
        return error(
          new ValidationError(
            'Provided milliseconds number is not a valid number'
          )
        );
      }
    },
    Error: ({ value: e }) => error(e),
  });
};

export const unsafeIntervalsFromStrings = (strings: string[]): Interval[] =>
  strings.map(str => interval(str).unsafeGet());

export const unsafeIntervalsFromStringsReversed = compose<
  string[],
  Interval[],
  Interval[]
>(
  reverse,
  unsafeIntervalsFromStrings
);
