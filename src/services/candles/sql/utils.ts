import { Interval, interval } from '../../../types';
import { div } from '../../../utils/interval';
const { compose, findLast, map, prop, sortBy, tail } = require('ramda');

/** highestDividerLessThan :: Interval i => (Interval i, string[]) -> i */
export const highestDividerLessThan = (inter: Interval, dividers: string[]) =>
  compose(
    findLast((i: Interval) => div(inter, i) >= 1),
    sortBy(prop('length')),
    // should always be valid cause its constants
    map((d: string) => interval(d).unsafeGet())
  )(dividers);

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
    [sum, [[]]]
  );

  return tail(result);
};
