import { QueryBuilder } from 'knex';
import { unsafeIntervalsFromStrings } from '../../../../utils/interval';
import { periodsToQueries, sql } from '../sql';

describe('sql queries from period', () => {
  it('should return empty array', () => {
    expect(
      periodsToQueries({
        amountAsset: '111',
        priceAsset: '222',
        timeStart: new Date('2019-03-25T00:00:00.000Z'),
        periods: [],
        matcher: '123',
      }).length
    ).toBe(0);
  });

  it('should return array with 3 queries (30m, 5m, 1m)', () => {
    const periodQueries = periodsToQueries({
      amountAsset: '111',
      priceAsset: '222',
      timeStart: new Date('2019-03-25T00:00:00.000Z'),
      periods: unsafeIntervalsFromStrings(['30m', '5m', '1m']),
      matcher: '123',
    });
    expect(periodQueries.length).toBe(3);
    expect(
      periodQueries.reduce(
        (sql: string, q: QueryBuilder) => `${sql} UNION ${q.toString()}`,
        ''
      )
    ).toMatchSnapshot();
  });

  it('should return array with 5 queries', () => {
    const periodQueries = periodsToQueries({
      amountAsset: '111',
      priceAsset: '222',
      timeStart: new Date('2019-03-25T00:00:00.000Z'),
      periods: unsafeIntervalsFromStrings(['30m', '15m', '1m', '1m', '1m']),
      matcher: '123',
    });
    expect(periodQueries.length).toBe(5);
    expect(
      periodQueries.reduce(
        (sql: string, q: QueryBuilder) => `${sql} UNION ${q.toString()}`,
        ''
      )
    ).toMatchSnapshot();
  });
});

describe('sql query from candles', () => {
  it('should search candles for 1h', () => {
    expect(
      sql({
        amountAsset: '111',
        priceAsset: '222',
        timeStart: new Date('2017-04-03T00:00:00.000Z'),
        timeEnd: new Date('2017-04-03T23:59:59.999Z'),
        interval: '1h',
        matcher: '123',
      })
    ).toMatchSnapshot();
  });

  it('should search candles for 1d', () => {
    expect(
      sql({
        amountAsset: '111',
        priceAsset: '222',
        timeStart: new Date('2017-04-03T00:00:00.000Z'),
        timeEnd: new Date('2017-04-03T23:59:59.999Z'),
        interval: '1d',
        matcher: '123',
      })
    ).toMatchSnapshot();
  });

  it('should search candles for 1m', () => {
    expect(
      sql({
        amountAsset: '111',
        priceAsset: '222',
        timeStart: new Date('2017-04-03T00:00:00.000Z'),
        timeEnd: new Date('2017-04-03T23:59:59.999Z'),
        interval: '1m',
        matcher: '123',
      })
    ).toMatchSnapshot();
  });
});
