const { transformPairInfo } = require('./common');

const { Pair } = require('../../../../types');

const { compose, map } = require('ramda');

const pairOrNull = maybePair =>
  maybePair.matchWith({
    Just: ({ value }) => Pair(value),
    Nothing: () => null,
  });

/** transformResults :: Maybe RawPairInfo -> Pair | null */
const transformResults = compose(
  pairOrNull,
  map(transformPairInfo)
);

module.exports = transformResults;
