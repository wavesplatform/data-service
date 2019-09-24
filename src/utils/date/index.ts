import { curry } from 'ramda';
import { Interval, Unit } from '../../types';

const precisions: Record<Unit, number> = {
  [Unit.Year]: 4,
  [Unit.Month]: 7,
  [Unit.Day]: 10,
  [Unit.Hour]: 13,
  [Unit.Minute]: 16,
  [Unit.Second]: 19,
};

const suffixes: Record<Unit, string> = {
  [Unit.Year]: '-01-01T00:00:00.000Z',
  [Unit.Month]: '-01T00:00:00.000Z',
  [Unit.Day]: 'T00:00:00.000Z',
  [Unit.Hour]: ':00:00.000Z',
  [Unit.Minute]: ':00.000Z',
  [Unit.Second]: 'Z',
};

const units = [
  Unit.Year,
  Unit.Month,
  Unit.Day,
  Unit.Hour,
  Unit.Minute,
  Unit.Second,
];

const unitBiggerThan = (unit: Unit, interval: Interval) =>
  units.indexOf(interval.unit) <= units.indexOf(unit);

type RoundFunction = (a: number) => number;
const roundUp = (x: number) => Math.ceil(x);
const roundDown = (x: number) => Math.floor(x);
const defaultRound = (x: number) => Math.round(x);

const roundTo = curry(
  (roundFn: RoundFunction, interval: Interval | null, date: Date): Date => {
    if (!interval) {
      throw new Error('Invalid Interval');
    }
    let newDate = new Date(date);

    switch (interval.unit) {
      case Unit.Year:
        newDate.setMonth(roundFn(newDate.getMonth() / 12) * 12);
        break;
      case Unit.Month:
        const d = daysInMonth(date.getFullYear(), date.getMonth()) - 1;
        newDate.setUTCDate(roundFn((date.getUTCDate() - 1) / d) * d + 1);
        break;
      default:
        newDate = new Date(
          roundFn(date.getTime() / interval.length) * interval.length
        );
    }

    if (unitBiggerThan(Unit.Year, interval)) {
      newDate.setUTCMonth(0);
    }
    if (unitBiggerThan(Unit.Month, interval)) {
      newDate.setUTCDate(1);
    }
    if (unitBiggerThan(Unit.Day, interval)) {
      newDate.setUTCHours(0);
    }
    if (unitBiggerThan(Unit.Hour, interval)) {
      newDate.setUTCMinutes(0);
    }
    if (unitBiggerThan(Unit.Minute, interval)) {
      newDate.setUTCSeconds(0);
    }
    newDate.setUTCMilliseconds(0);

    return newDate;
  }
);

export const trunc = curry(
  (unit: Unit, date: Date): string => {
    return date.toISOString().substr(0, precisions[unit]) + suffixes[unit];
  }
);

export const round = roundTo(defaultRound);
export const floor = roundTo(roundDown);
export const ceil = roundTo(roundUp);

export const add = curry(
  (interval: Interval, date: Date): Date =>
    new Date(date.getTime() + interval.length)
);

export const subtract = curry(
  (interval: Interval, date: Date): Date =>
    new Date(date.getTime() - interval.length)
);

const daysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();
