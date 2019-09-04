const { groupBy, map, pipe, toPairs } = require('ramda');
const { addMissingCandles, transformCandle } = require('../transformResults');
const { candleMonoid } = require('../candleMonoid');
const { interval, Unit } = require('../../../types');
const { floor, trunc } = require('../../../utils/date');
const { concatAll } = require('../../../utils/fp/concatAll');

const truncToMinutes = trunc(Unit.Minute);

const oneDayCandles = require('./mocks/oneDayCandles');
const monthCandles = require('./mocks/monthCandles');
const yearCandles = require('./mocks/yearCandles');

const date1 = new Date('2018-11-01T00:00:00.000Z'),
  date2 = new Date('2018-12-01T00:00:00.000Z');

const day = interval('1d').unsafeGet(),
  minute = interval('1m').unsafeGet(),
  month = interval('1M').unsafeGet();

const addMissing1mCandles = addMissingCandles(minute),
  addMissing1dCandles = addMissingCandles(day),
  addMissing1MCandles = addMissingCandles(month);

describe('add missing candles', () => {
  describe('with 1 minute interval', () => {
    it('should add empty candles to list of one candle for 1M period including the 1st day of next M', () => {
      expect(
        pipe(
          groupBy(candle =>
            truncToMinutes(floor(minute, new Date(candle.time_start)))
          ),
          addMissing1mCandles(date1, date2),
          toPairs
        )(oneDayCandles).length
      ).toBe(43201);
    });
    it('should add empty candles to list of thirty candles for 1M period including the 1st day of next M', () => {
      expect(
        pipe(
          groupBy(candle =>
            truncToMinutes(floor(minute, new Date(candle.time_start)))
          ),
          addMissing1mCandles(date1, date2),
          toPairs
        )(monthCandles).length
      ).toBe(43201);
    });
  });

  describe('with 1 day interval', () => {
    it('should add empty candles to list of one candle for 1M period including the 1st day of next M', () => {
      expect(
        pipe(
          groupBy(candle =>
            truncToMinutes(floor(day, new Date(candle.time_start)))
          ),
          addMissing1dCandles(date1, date2),
          toPairs
        )(oneDayCandles).length
      ).toBe(31);
    });

    it('should not add any candles to list of thirty candles for 1M period including the 1st day of next M', () => {
      expect(
        pipe(
          groupBy(candle =>
            truncToMinutes(floor(day, new Date(candle.time_start)))
          ),
          addMissing1dCandles(date1, date2),
          toPairs
        )(monthCandles).length
      ).toBe(31);
    });

    it('should not add candles to list of twenty candles for 1Y period including the last day of month', () => {
      expect(
        pipe(
          groupBy(candle =>
            truncToMinutes(floor(month, new Date(candle.time_start)))
          ),
          addMissing1MCandles(
            new Date('2017-10-01T00:00:00.000Z'),
            new Date('2018-10-01T00:00:00.000Z')
          ),
          toPairs
        )(yearCandles).length
      ).toBe(13);
    });
  });
});

describe('candle monoid', () => {
  it('should calculate 1 candle for 1 interval', () => {
    expect(concatAll(candleMonoid)(monthCandles)).toMatchSnapshot();
  });

  it('should calculate several candles for period with several intervals', () => {
    expect(
      pipe(
        groupBy(candle =>
          truncToMinutes(floor(minute, new Date(candle.time_start)))
        ),
        map(concatAll(candleMonoid))
      )(monthCandles)
    ).toMatchSnapshot();
  });
});

describe('transform candle fn', () => {
  it('take empty candle and returns correctly transformed for result candle', () => {
    expect(transformCandle([date1, candleMonoid.empty])).toMatchSnapshot();
  });

  it('take valid candle and returns correctly transformed for result candle', () => {
    expect(transformCandle([date1, oneDayCandles[0]])).toMatchSnapshot();
  });
});
