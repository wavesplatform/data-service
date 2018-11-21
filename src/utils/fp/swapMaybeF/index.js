const Maybe = require('folktale/maybe');
const { curry } = require('ramda');

/** (a -> F a) -> Maybe F a -> F Maybe a */
const swapMaybeF = (F, maybeM) =>
  console.log(maybeM) || maybeM.matchWith({
    Nothing: () => F(maybeM), // M Maybe r
    Just: ({ value }) => value.map(Maybe.of), // M Maybe r
  });

module.exports = curry(swapMaybeF);
