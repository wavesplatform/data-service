const swapMaybeF = require('../swapMaybeF');

const { compose, map, curry } = require('ramda');

/** liftInnerMaybe :: M -> (v -> M * v) -> Maybe v -> M * Maybe v */
const liftInnerMaybe = curry((mOf, fn, mb) =>
  compose(swapMaybeF(mOf), map(fn))(mb)
);

module.exports = liftInnerMaybe;
