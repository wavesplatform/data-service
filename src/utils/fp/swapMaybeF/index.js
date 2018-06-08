const Maybe = require('folktale/maybe');
const { curry } = require('ramda');

/** mOf -> Maybe M a -> M Maybe a */
const swapMaybeF = (mOf, maybeM) =>
  maybeM.matchWith({
    Nothing: () => mOf(maybeM), // M Maybe r
    Just: ({ value }) => value.map(Maybe.of), // M Maybe r
  });

module.exports = curry(swapMaybeF);
