const { transformAsset } = require('./common');

const { Asset } = require('../../../../types');

const { compose, map } = require('ramda');

const assetOrNull = maybeAsset =>
  maybeAsset.matchWith({
    Just: ({ value }) => Asset(value),
    Nothing: () => null,
  });

/** transformResults :: (Maybe RawAssetInfo)[] -> Asset | null */
const transformResults = compose(assetOrNull, map(transformAsset));

module.exports = transformResults;
