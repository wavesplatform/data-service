const { BigNumber } = require('@waves/data-entities');
const {
  leftNotNullMonoid,
  rightNotNullMonoid,
  sumMonoid,
  bigNumberPlusMonoid,
  maxMonoid,
  bigNumberHighestMonoid,
  bigNumberLowestMonoid,
  weightedAveragePriceMonoid,
  candleMonoid,
} = require('../candleMonoid');
const oneDayCandles = require('./mocks/oneDayCandles');

describe('monoid', () => {
  describe('left not null', () => {
    it('should return left arg', () => {
      expect(leftNotNullMonoid.concat('asd1', 'asd2')).toBe('asd1');
    });

    it('should return right arg', () => {
      expect(leftNotNullMonoid.concat(null, 'asd2')).toBe('asd2');
    });
  });

  describe('right not null', () => {
    it('should return right arg', () => {
      expect(rightNotNullMonoid.concat('asd1', 'asd2')).toBe('asd2');
    });

    it('should return left arg', () => {
      expect(rightNotNullMonoid.concat('asd1', null)).toBe('asd1');
    });
  });

  describe('sum', () => {
    it('should return sum of args', () => {
      expect(sumMonoid.concat(1, 2)).toBe(3);
    });
  });

  describe('big number plus', () => {
    it('shourd return big number of sum of args', () => {
      expect(bigNumberPlusMonoid.concat(BigNumber(1), BigNumber(2))).toEqual(
        BigNumber(3)
      );
    });
  });

  describe('max', () => {
    it('should return max monoid', () => {
      expect(maxMonoid.concat(10, 2)).toBe(10);
    });
  });

  describe('big number highest', () => {
    it('should return bignumber highest monoid', () => {
      expect(
        bigNumberHighestMonoid.concat(BigNumber(10), BigNumber(2))
      ).toEqual(BigNumber(10));
    });
  });

  describe('big number lowest', () => {
    it('should return bignumber lowest monoid', () => {
      expect(bigNumberLowestMonoid.concat(BigNumber(10), BigNumber(2))).toEqual(
        BigNumber(2)
      );
    });
  });

  describe('weighted average price', () => {
    it('should return weighted average price of candles monoid', () => {
      expect(
        weightedAveragePriceMonoid.concat(
          { quote_volume: BigNumber(2), volume: BigNumber(3) },
          { quote_volume: BigNumber(3), volume: BigNumber(2) }
        )
      ).toEqual(BigNumber(1));
    });
  });

  describe('candle', () => {
    it('should return two concated candle monoids', () => {
      expect(candleMonoid.concat(oneDayCandles[0], oneDayCandles[0])).toEqual({
        time_start: '2018-11-15T14:03:00.000Z',
        open: BigNumber(0.01),
        close: BigNumber(0.0001),
        low: BigNumber(1e-8),
        high: BigNumber(0.01),
        volume: BigNumber(5684),
        quote_volume: BigNumber(6.6000884),
        weighted_average_price: BigNumber(0.0011),
        max_height: 377979,
        txs_count: 40,
      });
    });
  });
});
