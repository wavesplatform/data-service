const { transformAssetInfo } = require('./common');

const { Asset, fromMaybe } = require('../../../types');

const { head, compose, map } = require('ramda');

/** transformResults :: (Maybe RawAssetInfo)[] -> Asset */
const transformResults = compose(
  fromMaybe(Asset),
  map(transformAssetInfo),
  head
);

module.exports = transformResults;
