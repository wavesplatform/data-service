const { matchRequestsResults } = require('../../../utils/db/index');
const { curryN } = require('ramda');

module.exports = curryN(3, (matchFn, requests, results) =>
  matchRequestsResults(matchFn, requests, results).map(mx => mx.getOrElse(null))
);
