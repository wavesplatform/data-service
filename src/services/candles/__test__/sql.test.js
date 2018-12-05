const Interval = require('../../../types/Interval');
const { highestDividerLessThen } = require('../sql');

describe('candles sql helper functions', () => {
  it('highest divider less then', () => {
    expect(highestDividerLessThen(Interval('1m'), ['1m', '1h', '1d']).length).toBe(Interval('1m').length);
    expect(highestDividerLessThen(Interval('10m'), ['5m', '15m', '1h']).length).toBe(Interval('5m').length);
    expect(highestDividerLessThen(Interval('15m'), ['5m', '15m', '1h']).length).toBe(Interval('15m').length);
    expect(highestDividerLessThen(Interval('1h'), ['1m', '1h', '1d']).length).toBe(Interval('1h').length);
  });
});
