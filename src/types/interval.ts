import { Result, Ok as ok, Error as error } from 'folktale/result';
import { ValidationError } from '../errorHandling';
import { interval as intervalRegex } from '../utils/regex';

export enum Unit {
  Second = 's',
  Minute = 'm',
  Hour = 'h',
  Day = 'd',
  Month = 'M',
  Year = 'Y',
}

export const units: Record<Unit, number> = {
  [Unit.Second]: 1,
  [Unit.Minute]: 60,
  [Unit.Hour]: 60 * 60,
  [Unit.Day]: 60 * 60 * 24,
  [Unit.Month]: 60 * 60 * 24 * 31,
  [Unit.Year]: 60 * 60 * 24 * 31 * 366,
};

export const parseUnit = (s: string): Result<ValidationError, Unit> => {
  switch (s.substr(-1)) {
    case Unit.Second:
      return ok(Unit.Second);
    case Unit.Minute:
      return ok(Unit.Minute);
    case Unit.Hour:
      return ok(Unit.Hour);
    case Unit.Day:
      return ok(Unit.Day);
    case Unit.Month:
      return ok(Unit.Month);
    case Unit.Year:
      return ok(Unit.Year);
    default:
      return error(new ValidationError('Provided string is not a valid unit.'));
  }
};

/** Calculates interval length in milliseconds **/
const parseLength = (
  s: string,
  unit: Unit
): Result<ValidationError, number> => {
  const sub = s.substr(0, s.length - 1);
  const n = parseInt(sub);
  return !isNaN(n)
    ? ok(n * units[unit] * 1000)
    : error(
        new ValidationError('Provided string is not a valid intervallength.')
      );
};

export type Interval = {
  length: number;
  unit: Unit;
  source: string;
};

export const interval = (source: string): Result<ValidationError, Interval> => {
  if (!intervalRegex.test(source))
    return error(
      new ValidationError('String argument does not match interval pattern')
    );

  return parseUnit(source).matchWith({
    Ok: ({ value: unit }) => {
      return parseLength(source, unit).matchWith({
        Ok: ({ value: length }) =>
          ok({
            length,
            unit,
            source,
          }),
        Error: ({ value: e }) => error(e),
      });
    },
    Error: ({ value: e }) => error(e),
  });
};
