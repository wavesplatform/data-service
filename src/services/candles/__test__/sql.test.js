const Interval = require('../../../types/Interval');
const { highestDividerLessThen, sql } = require('../sql');

describe('candles sql helper functions', () => {
  it('highest divider less then', () => {
    expect(
      highestDividerLessThen(Interval('1m'), ['1m', '1h', '1d']).length
    ).toBe(Interval('1m').length);
    expect(
      highestDividerLessThen(Interval('10m'), ['5m', '15m', '1h']).length
    ).toBe(Interval('5m').length);
    expect(
      highestDividerLessThen(Interval('15m'), ['5m', '15m', '1h']).length
    ).toBe(Interval('15m').length);
    expect(
      highestDividerLessThen(Interval('1h'), ['1m', '1h', '1d']).length
    ).toBe(Interval('1h').length);
  });
});

describe('sql query from candles', () => {
  it('should search candles for 1h', () => {
    expect(
      sql({
        amountAsset: '111',
        priceAsset: '222',
        params: {
          timeStart: new Date('2017-04-03T00:00:00.000Z'),
          timeEnd: new Date('2017-04-03T23:59:59.999Z'),
          interval: '1h',
        },
      })
    ).toMatchSnapshot();
  });

  it('should search candles for 1d', () => {
    expect(
      sql({
        amountAsset: '111',
        priceAsset: '222',
        params: {
          timeStart: new Date('2017-04-03T00:00:00.000Z'),
          timeEnd: new Date('2017-04-03T23:59:59.999Z'),
          interval: '1d',
        },
      })
    ).toMatchSnapshot();
  });

  it('should search candles for 1m', () => {
    expect(
      sql({
        amountAsset: '111',
        priceAsset: '222',
        params: {
          timeStart: new Date('2017-04-03T00:00:00.000Z'),
          timeEnd: new Date('2017-04-03T23:59:59.999Z'),
          interval: '1m',
        },
      })
    ).toMatchSnapshot();
  });
});
