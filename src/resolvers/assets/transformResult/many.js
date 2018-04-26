const { transformAssetInfo } = require('./common');

const { Asset, List, fromMaybe } = require('../../../types');

const { map, compose } = require('ramda');

/** transformResults :: (Maybe RawAssetInfo)[] -> List Asset */
const transformResults = compose(
  List,
  map(fromMaybe(Asset)),
  map(map(transformAssetInfo))
);

module.exports = transformResults;
