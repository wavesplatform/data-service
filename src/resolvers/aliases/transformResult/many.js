const { Alias, List, fromMaybe } = require('../../../types');

const { map, compose } = require('ramda');

/** transformResults :: (Maybe RawAliasInfo)[] -> List Alias */
const transformResults = compose(
  List,
  map(fromMaybe(Alias))
);

module.exports = transformResults;
