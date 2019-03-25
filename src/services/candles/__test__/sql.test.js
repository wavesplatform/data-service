const { interval } = require('../../../types/');
const { highestDividerLessThen, sql } = require('../sql');

describe('candles sql helper functions', () => {
  it('highest divider less then', () => {
    expect(
      highestDividerLessThen(interval('1m').unsafeGet(), ['1m', '1h', '1d'])
        .length
    ).toBe(interval('1m').unsafeGet().length);
    expect(
      highestDividerLessThen(interval('10m').unsafeGet(), ['5m', '15m', '1h'])
        .length
    ).toBe(interval('5m').unsafeGet().length);
    expect(
      highestDividerLessThen(interval('15m').unsafeGet(), ['5m', '15m', '1h'])
        .length
    ).toBe(interval('15m').unsafeGet().length);
    expect(
      highestDividerLessThen(interval('1h').unsafeGet(), ['1m', '1h', '1d'])
        .length
    ).toBe(interval('1h').unsafeGet().length);
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
