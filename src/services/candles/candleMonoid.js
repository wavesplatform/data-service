const Monoid = require('../../types/Monoid');
const { BigNumber } = require('@waves/data-entities');

// common
const leftNotNullMonoid = new Monoid({
  concat: (a, b) => a || b,
  empty: null,
});

const rightNotNullMonoid = new Monoid({
  concat: (a, b) => b || a,
  empty: null,
});

const sumMonoid = new Monoid({
  concat: (a, b) => a + b,
  empty: 0,
});

const bigNumberPlusMonoid = new Monoid({
  concat: (a, b) => a.plus(b),
  empty: BigNumber(0),
});

const maxMonoid = new Monoid({
  concat: (a, b) => Math.max(a, b),
  empty: 0,
});

const bigNumberLowestMonoid = new Monoid({
  concat: (a, b) => (a.comparedTo(b) === 1 ? b : a),
  empty: BigNumber(+Infinity),
});

const bigNumberHighestMonoid = new Monoid({
  concat: (a, b) => (a.comparedTo(b) === 1 ? a : b),
  empty: BigNumber(-Infinity),
});

// individual
const weightedAveragePriceMonoid = new Monoid({
  concat: (a, b) =>
    a.weighted_average_price
      .multipliedBy(a.volume)
      .plus(b.weighted_average_price.multipliedBy(b.volume))
      .dividedBy(a.volume.plus(b.volume)),
  empty: BigNumber(0),
});

const candleMonoid = new Monoid({
  concat: (a, b) => ({
    time_start: leftNotNullMonoid.concat(a.time_start, b.time_start),
    open: leftNotNullMonoid.concat(a.open, b.open),
    close: rightNotNullMonoid.concat(a.close, b.close),
    high: bigNumberHighestMonoid.concat(a.high, b.high),
    low: bigNumberLowestMonoid.concat(a.low, b.low),
    volume: bigNumberPlusMonoid.concat(a.volume, b.volume),
    price_volume: bigNumberPlusMonoid.concat(a.price_volume, b.price_volume),
    weighted_average_price: weightedAveragePriceMonoid.concat(a, b),
    max_height: maxMonoid.concat(a.max_height, b.max_height),
    txs_count: sumMonoid.concat(a.txs_count, b.txs_count),
  }),
  empty: {
    time_start: leftNotNullMonoid.empty,
    open: leftNotNullMonoid.empty,
    close: rightNotNullMonoid.empty,
    high: bigNumberHighestMonoid.empty,
    low: bigNumberLowestMonoid.empty,
    volume: bigNumberPlusMonoid.empty,
    price_volume: bigNumberPlusMonoid.empty,
    weighted_average_price: weightedAveragePriceMonoid.empty,
    max_height: maxMonoid.empty,
    txs_count: sumMonoid.empty,
  },
});

module.exports = {
  leftNotNullMonoid,
  rightNotNullMonoid,
  sumMonoid,
  bigNumberPlusMonoid,
  maxMonoid,
  bigNumberHighestMonoid,
  bigNumberLowestMonoid,
  weightedAveragePriceMonoid,
  candleMonoid,
};
