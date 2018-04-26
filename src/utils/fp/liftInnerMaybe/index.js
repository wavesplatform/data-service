const swapMaybeM = require('../swapMaybeM');

const { compose, map, curry } = require('ramda');

/** liftInnerM :: M -> (v -> M * v) -> Maybe v -> M * Maybe v */
const liftInnerMaybe = curry((mOf, fn, mb) =>
  compose(swapMaybeM(mOf), map(fn))(mb)
);

module.exports = liftInnerMaybe;
