// @todo to typescript
const { interval } = require('../../../types');
const { highestDividerLessThen, periodToQueries, sql } = require('../sql/sql');

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

describe('sql queries from period', () => {
  const dividers = ['1m', '5m', '15m', '30m', '1h', '3h', '6h', '12h', '1d'];
  it('should return empty array', () => {
    expect(
      periodToQueries({
        amountAsset: '111',
        priceAsset: '222',
        timeStart: new Date('2019-03-25T00:00:00.000Z'),
        period: null,
        dividers,
      }).length
    ).toBe(0);
  });

  it('should return array with 3 queries (30m, 5m, 1m)', () => {
    const periodQueries = periodToQueries({
      amountAsset: '111',
      priceAsset: '222',
      timeStart: new Date('2019-03-25T00:00:00.000Z'),
      period: '36m',
      dividers,
    });
    expect(periodQueries.length).toBe(3);
    expect(
      periodQueries.reduce((sql, q) => `${sql} UNION ${q.toString()}`)
    ).toMatchSnapshot();
  });

  it('should return array with 5 queries', () => {
    const periodQueries = periodToQueries({
      amountAsset: '111',
      priceAsset: '222',
      timeStart: new Date('2019-03-25T00:00:00.000Z'),
      period: '48m',
      dividers,
    });
    expect(periodQueries.length).toBe(5);
    expect(
      periodQueries.reduce((sql, q) => `${sql} UNION ${q.toString()}`)
    ).toMatchSnapshot();
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
