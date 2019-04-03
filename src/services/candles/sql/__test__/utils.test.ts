import { interval } from '../../../../types';
import { highestDividerLessThan, numberToUnitsPolynom } from '../utils';
import { unsafeIntervalsFromStrings } from '../../../../utils/interval';

const UNITS = [1440, 720, 360, 180, 60, 30, 15, 5, 1];

describe('candles sql helper functions', () => {
  it('highest divider less then', () => {
    expect(
      highestDividerLessThan(
        interval('1m').unsafeGet(),
        unsafeIntervalsFromStrings(['1m', '1h', '1d'])
      ).unsafeGet().length
    ).toBe(interval('1m').unsafeGet().length);
    expect(
      highestDividerLessThan(
        interval('10m').unsafeGet(),
        unsafeIntervalsFromStrings(['5m', '15m', '1h'])
      ).unsafeGet().length
    ).toBe(interval('5m').unsafeGet().length);
    expect(
      highestDividerLessThan(
        interval('15m').unsafeGet(),
        unsafeIntervalsFromStrings(['5m', '15m', '1h'])
      ).unsafeGet().length
    ).toBe(interval('15m').unsafeGet().length);
    expect(
      highestDividerLessThan(
        interval('1h').unsafeGet(),
        unsafeIntervalsFromStrings(['1m', '1h', '1d'])
      ).unsafeGet().length
    ).toBe(interval('1h').unsafeGet().length);
  });
});

describe('numberToUnitsPolynom fn', () => {
  it('should return correct result for 36', () => {
    expect(numberToUnitsPolynom(UNITS, 36)).toEqual([[30, 1], [5, 1], [1, 1]]);
  });

  it('should return correct result for 48', () => {
    expect(numberToUnitsPolynom(UNITS, 48)).toEqual([[30, 1], [15, 1], [1, 3]]);
  });

  it('should return correct result for 59', () => {
    expect(numberToUnitsPolynom(UNITS, 59)).toEqual([
      [30, 1],
      [15, 1],
      [5, 2],
      [1, 4],
    ]);
  });

  it('should return correct result for 129', () => {
    expect(numberToUnitsPolynom(UNITS, 129)).toEqual([[60, 2], [5, 1], [1, 4]]);
  });
});
