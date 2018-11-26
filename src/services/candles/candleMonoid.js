const Monoid = require('../../types/Monoid');
const { BigNumber } = require('@waves/data-entities');

const timeStartMonoid = new Monoid({
  concat: (a, b) => !a ? b : a,
  empty: null,
});

const openMonoid = new Monoid({
  concat: (a, b) => (a === null ? b : a),
  empty: null,
});

const closeMonoid = new Monoid({
  concat: (a, b) => (b === null ? a : b),
  empty: null,
});

const lowMonoid = new Monoid({
  concat: (a, b) => (a.comparedTo(b) === 1 ? b : a),
  empty: BigNumber(+Infinity),
});

const highMonoid = new Monoid({
  concat: (a, b) => (a.comparedTo(b) === 1 ? a : b),
  empty: BigNumber(-Infinity),
});

const volumeMonoid = new Monoid({
  concat: (a, b) => a.plus(b),
  empty: BigNumber(0),
});

const priceVolumeMonoid = new Monoid({
  concat: (a, b) => a.plus(b),
  empty: BigNumber(0),
});

const weightedAveragePriceMonoid = new Monoid({
  concat: (a, b) => {
    return a.weighted_average_price
      .multipliedBy(a.volume)
      .plus(b.weighted_average_price.multipliedBy(b.volume))
      .dividedBy(a.volume.plus(b.volume));
  },
  empty: BigNumber(0),
});

const maxHeightMonoid = new Monoid({
  concat: (a, b) => Math.max(a, b),
  empty: 0,
});

const txsCountMonoid = new Monoid({
  concat: (a, b) => a + b,
  empty: 0,
});

const candleMonoid = new Monoid({
  concat: (a, b) => ({
    time_start: timeStartMonoid.concat(a.time_start, b.time_start),
    open: openMonoid.concat(a.open, b.open),
    close: closeMonoid.concat(a.close, b.close),
    high: highMonoid.concat(a.high, b.high),
    low: lowMonoid.concat(a.low, b.low),
    volume: volumeMonoid.concat(a.volume, b.volume),
    price_volume: priceVolumeMonoid.concat(a.price_volume, b.price_volume),
    weighted_average_price: weightedAveragePriceMonoid.concat(a, b),
    max_height: maxHeightMonoid.concat(a.max_height, b.max_height),
    txs_count: txsCountMonoid.concat(a.txs_count, b.txs_count),
  }),
  empty: {
    time_start: timeStartMonoid.empty,
    open: openMonoid.empty,
    close: closeMonoid.empty,
    high: highMonoid.empty,
    low: lowMonoid.empty,
    volume: volumeMonoid.empty,
    price_volume: priceVolumeMonoid.empty,
    weighted_average_price: weightedAveragePriceMonoid.empty,
    max_height: maxHeightMonoid.empty,
    txs_count: txsCountMonoid.empty,
  },
});

module.exports = { candleMonoid };
