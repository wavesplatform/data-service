const { BigNumber } = require('@waves/data-entities');

// common
const leftNotNullMonoid = {
  concat: (a, b) => a || b,
  empty: null,
};

const rightNotNullMonoid = {
  concat: (a, b) => b || a,
  empty: null,
};

const sumMonoid = {
  concat: (a, b) => a + b,
  empty: 0,
};

const bigNumberPlusMonoid = {
  concat: (a, b) => a.plus(b),
  empty: BigNumber(0),
};

const maxMonoid = {
  concat: (a, b) => Math.max(a, b),
  empty: 0,
};

const bigNumberLowestMonoid = {
  concat: (a, b) => (a.comparedTo(b) === 1 ? b : a),
  empty: BigNumber(+Infinity),
};

const bigNumberHighestMonoid = {
  concat: (a, b) => (a.comparedTo(b) === 1 ? a : b),
  empty: BigNumber(-Infinity),
};

// individual
const weightedAveragePriceMonoid = {
  concat: (a, b) =>
    a.quote_volume.plus(b.quote_volume).dividedBy(a.volume.plus(b.volume)),
  empty: BigNumber(0),
};

const candleMonoid = {
  concat: (a, b) => ({
    time_start: leftNotNullMonoid.concat(a.time_start, b.time_start),
    open: leftNotNullMonoid.concat(a.open, b.open),
    close: rightNotNullMonoid.concat(a.close, b.close),
    high: bigNumberHighestMonoid.concat(a.high, b.high),
    low: bigNumberLowestMonoid.concat(a.low, b.low),
    volume: bigNumberPlusMonoid.concat(a.volume, b.volume),
    quote_volume: bigNumberPlusMonoid.concat(a.quote_volume, b.quote_volume),
    weighted_average_price: weightedAveragePriceMonoid.concat(a, b),
    max_height: maxMonoid.concat(a.max_height, b.max_height),
    txs_count: sumMonoid.concat(a.txs_count, b.txs_count),
    a_dec: maxMonoid.concat(a.a_dec, b.a_dec),
    p_dec: maxMonoid.concat(a.p_dec, b.p_dec),
  }),
  empty: {
    time_start: leftNotNullMonoid.empty,
    open: leftNotNullMonoid.empty,
    close: rightNotNullMonoid.empty,
    high: bigNumberHighestMonoid.empty,
    low: bigNumberLowestMonoid.empty,
    volume: bigNumberPlusMonoid.empty,
    quote_volume: bigNumberPlusMonoid.empty,
    weighted_average_price: weightedAveragePriceMonoid.empty,
    max_height: maxMonoid.empty,
    txs_count: sumMonoid.empty,
    a_dec: rightNotNullMonoid.empty,
    p_dec: rightNotNullMonoid.empty,
  },
};

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
