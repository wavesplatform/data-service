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

const parseUnit = (s: string): Result<ValidationError, Unit> => {
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
  const units: Record<Unit, number> = {
    [Unit.Second]: 1,
    [Unit.Minute]: 60,
    [Unit.Hour]: 60 * 60,
    [Unit.Day]: 60 * 60 * 24,
    [Unit.Month]: 60 * 60 * 24 * 31,
    [Unit.Year]: 60 * 60 * 24 * 31 * 366,
  };
  const sub = s.substr(0, s.length - 1);
  const n = parseInt(sub);
  return !isNaN(n)
    ? ok(n * units[unit] * 1000)
    : error(
        new ValidationError('Provided string is not a valid intervallength.')
      );
};

export default class Interval {
  private constructor(length: number, unit: Unit, source: string) {
    this.length = length;
    this.unit = unit;
    this.source = source;
  }

  public static from(s: string): Result<ValidationError, Interval> {
    if (!intervalRegex.test(s))
      return error(
        new ValidationError('String argument does not match interval pattern')
      );

    return parseUnit(s).matchWith({
      Ok: ({ value: unit }) => {
        return parseLength(s, unit).matchWith({
          Ok: ({ value: length }) => ok(new Interval(length, unit, s)),
          Error: ({ value: e }) => error(e),
        });
      },
      Error: ({ value: e }) => error(e),
    });
  }

  public div(i: Interval): number {
    return this.length / i.length;
  }

  public toString(): string {
    return this.source;
  }

  public toJSON(): string {
    return this.source;
  }

  readonly unit: Unit;
  readonly length: number;
  private source: string;
}
