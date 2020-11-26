import { parseDate } from '../parseDate';

// parseDate always receives string from queryString
describe('parseDate', () => {
  it('works with positive numberish string', () => {
    const dateStr = '1525132800000';
    const expectedValue = new Date(1525132800000);

    expect(parseDate(dateStr).unsafeGet()).toEqual(expectedValue);
  });
  it('works with negative numberish string', () => {
    const dateStr = '-1525132800000';
    const expectedValue = new Date(-1525132800000);

    expect(parseDate(dateStr).unsafeGet()).toEqual(expectedValue);
  });
  it('works with timestamp', () => {
    const dateStr = '2018-05-01T00:00:00.000Z';
    const expectedValue = new Date('2018-05-01T00:00:00.000Z');

    expect(parseDate(dateStr).unsafeGet()).toEqual(expectedValue);
  });
  it('works with short timestamp', () => {
    const dateStr = '2018-05-01';
    const expectedValue = new Date('2018-05-01T00:00:00.000Z');

    expect(parseDate(dateStr).unsafeGet()).toEqual(expectedValue);
  });
  it('works with short timestamp in ru locale', () => {
    const dateStr = '01.05.2018';
    const expectedValue = new Date('2018-01-05T00:00:00.000');

    expect(parseDate(dateStr).unsafeGet()).toEqual(expectedValue);
  });
});
