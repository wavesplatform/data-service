const { matchRequestsResults } = require('../../../utils/db/index');

const { compose, map } = require('ramda');

module.exports = compose(
  map(mx => mx.getOrElse(null)),
  matchRequestsResults
);
