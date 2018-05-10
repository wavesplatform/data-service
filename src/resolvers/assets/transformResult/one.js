const { transformAsset } = require('./common');

const { Asset } = require('../../../types');

const { head, compose, map } = require('ramda');

const assetOrNull = maybeAsset =>
  maybeAsset.matchWith({
    Just: ({ value }) => Asset(value),
    Nothing: () => null,
  });

/** transformResults :: (Maybe RawAssetInfo)[] -> Asset | null */
const transformResults = compose(assetOrNull, map(transformAsset), head);

module.exports = transformResults;
