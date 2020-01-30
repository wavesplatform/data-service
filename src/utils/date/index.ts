import { curry } from 'ramda';
import { Interval, Unit } from '../../types';
import { units } from '../../types/interval';

const precisions: Record<Unit, number> = {
  [Unit.Year]: 4,
  [Unit.Month]: 7,
  [Unit.Week]: 10,
  [Unit.Day]: 10,
  [Unit.Hour]: 13,
  [Unit.Minute]: 16,
  [Unit.Second]: 19,
};

const suffixes: Record<Unit, string> = {
  [Unit.Year]: '-01-01T00:00:00.000Z',
  [Unit.Month]: '-01T00:00:00.000Z',
  [Unit.Week]: 'T00:00:00.000Z',
  [Unit.Day]: 'T00:00:00.000Z',
  [Unit.Hour]: ':00:00.000Z',
  [Unit.Minute]: ':00.000Z',
  [Unit.Second]: 'Z',
};

const unitsAsc = [
  Unit.Second,
  Unit.Minute,
  Unit.Hour,
  Unit.Day,
  Unit.Week,
  Unit.Month,
  Unit.Year,
];

enum Order {
  Less = -1,
  Equals = 0,
  Bigger = 1,
}

const unitsOrder = (units: Unit[]) => (a: Unit, b: Unit) =>
  units.indexOf(a) < units.indexOf(b)
    ? Order.Less
    : units.indexOf(a) === units.indexOf(b)
    ? Order.Equals
    : Order.Bigger;

type RoundFunction = (a: number) => number;
const roundUp = (x: number) => Math.ceil(x);
const roundDown = (x: number) => Math.floor(x);
const defaultRound = (x: number) => Math.round(x);

const roundTo = curry(
  (
    ascOrderedUnits: Unit[],
    roundFn: RoundFunction,
    interval: Interval | null,
    date: Date
  ): Date => {
    if (!interval) {
      throw new Error('Invalid Interval');
    }

    const unitsAscOrder = unitsOrder(ascOrderedUnits);

    return ascOrderedUnits.reduce((date, currentUnit) => {
      if (
        [Order.Less, Order.Equals].includes(
          unitsAscOrder(currentUnit, interval.unit)
        )
      ) {
        // round week
        if (currentUnit === Unit.Week) {
          const newDate = new Date(date);
          if (interval.unit === Unit.Week) {
            newDate.setUTCDate(
              newDate.getUTCDate() -
                newDate.getUTCDay() +
                roundFn((newDate.getUTCDay() - 1) / 7) * 7 +
                1
            );
          }
          return newDate;
        } else if (currentUnit === Unit.Month) {
          const newDate = new Date(date);
          // round month (not greater than 1 month)
          const d = daysInMonth(
            newDate.getUTCFullYear(),
            newDate.getUTCMonth()
          );
          newDate.setUTCDate(roundFn((newDate.getUTCDate() - 1) / d) * d + 1);
          return newDate;
        } else if (currentUnit === Unit.Year) {
          // round year  (not greater than 1 year)
          const newDate = new Date(date);
          newDate.setUTCMonth(roundFn(newDate.getUTCMonth() / 12) * 12);
          return newDate;
        } else {
          // round ms, seconds, minutes, hours
          const unitLength =
            currentUnit === interval.unit
              ? interval.length
              : units[currentUnit] * 1000;
          return new Date(roundFn(date.getTime() / unitLength) * unitLength);
        }
      } else {
        return date;
      }
    }, new Date(date));
  }
);

const roundToWithUnits = roundTo(unitsAsc);

export const round = roundToWithUnits(defaultRound);
export const floor = roundToWithUnits(roundDown);
export const ceil = roundToWithUnits(roundUp);

export const trunc = curry((unit: Unit, date: Date): string => {
  const newDate = new Date(date);
  if (unit === Unit.Week) {
    return (
      new Date(
        newDate.setUTCDate(newDate.getUTCDate() - newDate.getUTCDay() + 1)
      )
        .toISOString()
        .substr(0, precisions[Unit.Day]) + suffixes[Unit.Day]
    );
  } else {
    return newDate.toISOString().substr(0, precisions[unit]) + suffixes[unit];
  }
});

export const add = curry(
  (interval: Interval, date: Date): Date =>
    new Date(date.getTime() + interval.length)
);

export const subtract = curry(
  (interval: Interval, date: Date): Date =>
    new Date(date.getTime() - interval.length)
);

const daysInMonth = (year: number, month: number) =>
  // next month (month + 1) with 0 date of month -> last date of month
  new Date(year, month + 1, 0).getDate();
