const { transformPairInfo } = require('./common');

const { Pair, List, fromMaybe } = require('../../../../types');

const { map, compose } = require('ramda');

/** transformResults :: (Maybe RawPairInfo)[] -> List Pair */
const transformResults = compose(
  List,
  map(fromMaybe(Pair)),
  map(map(transformPairInfo))
);

module.exports = transformResults;
