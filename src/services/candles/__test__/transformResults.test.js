const { groupBy, map, mapObjIndexed, pipe, values } = require('ramda');
const { addMissingCandles, transformCandle } = require('../transformResults');
const { candleMonoid } = require('../candleMonoid');
const { Interval } = require('../../../types');
const { floor } = require('../../../utils/date');
const concatAll = require('../../../utils/fp/concatAll');

const data1Candles = require('./mocks/data-1-candles');
const dataMonthCandles = require('./mocks/data-month-candles');
const date1 = new Date(1541019600000), // 1st nov 2018 00:00:00.000 +03:00
  date2 = new Date(1543611600000); // 1st dec 2018 00:00:00.000 +03:00
const intervalD = Interval('1d'),
  intervalM = Interval('1m');
const addMissing1mCandles = addMissingCandles(intervalM),
  addMissing1dCandles = addMissingCandles(intervalD);

describe('add missing candles', () => {
  describe('with 1 minute interval', () => {
    it('should add empty candles for period with 1 candle at half of month', () => {
      expect(
        pipe(
          groupBy(candle => {
            return floor(intervalM, new Date(candle.time_start))
              .toISOString()
              .substr(0, 16);
          }),
          addMissing1mCandles(
            date1.valueOf(),
            date2.valueOf(),
          ),
          mapObjIndexed((candle, time) => [candle, time]),
          values,
        )(data1Candles).length
      ).toBe(43201);
    });
    it('should add empty candles for period with 1 candle at each day', () => {
      expect(
        pipe(
          groupBy(candle => {
            return floor(intervalM, new Date(candle.time_start))
              .toISOString()
              .substr(0, 16);
          }),
          addMissing1mCandles(
            date1.valueOf(),
            date2.valueOf(),
          ),
          mapObjIndexed((candle, time) => [candle, time]),
          values,
        )(dataMonthCandles).length
      ).toBe(43201);
    });
  });

  describe('with 1 day interval', () => {
    it('should add empty candles in period with 1 candle at half', () => {
      expect(
        pipe(
          groupBy(candle => {
            return floor(intervalD, new Date(candle.time_start))
              .toISOString()
              .substr(0, 16);
          }),
          addMissing1dCandles(date1.valueOf(), date2.valueOf()),
          mapObjIndexed((candle, time) => [candle, time]),
          values,
        )(data1Candles).length
      ).toBe(30);
    });

    it('should not add candles in period with 1 candle at each interval', () => {
      expect(
        pipe(
          groupBy(candle => {
            return floor(intervalD, new Date(candle.time_start))
              .toISOString()
              .substr(0, 16);
          }),
          addMissing1dCandles(date1.valueOf(), date2.valueOf()),
          mapObjIndexed((candle, time) => [candle, time]),
          values,
        )(dataMonthCandles).length
      ).toBe(30);
    });
  });
});

describe('candle monoid', () => {
  it('should calculate 1 candle for 1 interval', () => {
    expect(concatAll(candleMonoid, dataMonthCandles)).toMatchSnapshot();
  });

  it('should calculate several candles for period with several intervals', () => {
    expect(
      pipe(
        groupBy(candle => {
          return floor(intervalM, new Date(candle.time_start))
            .toISOString()
            .substr(0, 16);
        }),
        map(concatAll(candleMonoid)),
      )(dataMonthCandles)
    ).toMatchSnapshot();
  });
});

describe('transform candle fn', () => {
  it('take empty candle and returns correctly transformed for result candle', () => {
    expect(transformCandle([{txs_count: null}, date1])).toMatchSnapshot();
  });

  it('take valid candle and returns correctly transformed for result candle', () => {
    expect(transformCandle([data1Candles[0], date1])).toMatchSnapshot();
  });
});
