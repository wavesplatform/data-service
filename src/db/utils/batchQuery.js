const { curry, find, map } = require('ramda');

const batchQuery = (matchFn, requests, results) => {
  const mf = curry(matchFn);
  const findRes = req => find(mf(req), results) || null;
  return map(findRes, requests);
};

module.exports = curry(batchQuery);
