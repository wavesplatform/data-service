const { matchRequestsResults } = require('../../../utils/db/index');
const { curryN, uncurryN, compose, map } = require('ramda');

module.exports = curryN(
  3,
  compose(
    map(mx => mx.getOrElse(null)),
    uncurryN(3, matchRequestsResults)
  )
);
