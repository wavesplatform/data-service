const { curry, find, map } = require('ramda');

const Maybe = require('folktale/Maybe');

/** maybeResults :: (Request Result -> Boolean) -> Request[] -> Result[] -> (Maybe Result)[] */
const maybeResults = (matchFn, requests, results) => {
  /** mf :: Request -> Result -> Boolean */
  const mf = curry(matchFn);

  /** maybeFindRes :: Request -> Maybe Result */
  const maybeFindRes = req => Maybe.fromNullable(find(mf(req), results));

  return map(maybeFindRes, requests);
};

module.exports = curry(maybeResults);
