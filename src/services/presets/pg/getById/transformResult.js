const { compose, map } = require('ramda');

// @todo parameterize output type
/** dataOrNull :: t -> Maybe DbResponse -> Maybe */
const dataOrNull = typeFactory => maybe =>
  maybe.matchWith({
    Just: ({ value }) => typeFactory(value),
    Nothing: () => null,
  });

/** transformResults :: t -> transformDbResponse -> (Maybe DbResponse) -> t | null */
const transformResults = typeFactory => transformDbResponse =>
  compose(
    dataOrNull(typeFactory),
    map(transformDbResponse)
  );

module.exports = transformResults;
