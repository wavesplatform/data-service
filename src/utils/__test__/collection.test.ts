import { identity } from 'ramda';
import { collect } from '../collection';

describe('collect function', () => {
  it('should return empty arr when input arr is empty', () => {
    expect(collect(identity)([])).toEqual([]);
  });

  it('should return full copy of input arr, when fn does not any changes and does not return undefined', () => {
    const arr = [1, 2, 3];
    expect(collect(identity)(arr)).toEqual(arr);
    expect(collect(identity)(arr)).not.toBe(arr);
  });

  it('should not mutate input array', () => {
    const arr = [1, 2, 3, 4, 5];
    collect(() => undefined)(arr);
    expect(arr.length).toEqual(5);
  });

  // A[] -> A[]
  it('should work when used as a filter', () => {
    const evenArr = [2, 4];
    const arr = [1, 3, 5, ...evenArr];
    const isEven = (n: number) => (n % 2 === 0 ? n : undefined);
    expect(collect(isEven)(arr)).toEqual(evenArr);
  });

  // // A[] -> B[]
  it('should work when used as map with type change', () => {
    const arr = [1, 2, 3];

    const transform = (n: number) => n.toString();

    const expected = ['1', '2', '3'];

    expect(collect(transform)(arr)).toEqual(expected);
  });

  // together
  it('should work as a filter + map with type change', () => {
    const arr = [1, 2, 3, 4, 5];

    const takeOddToString = (n: number): string | undefined =>
      n % 2 === 1 ? n.toString() + 'w' : undefined;

    const expected = ['1w', '3w', '5w'];

    expect(collect(takeOddToString)(arr)).toEqual(expected);
  });
});
