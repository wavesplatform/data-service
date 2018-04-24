const { transformAssetInfo } = require('./common');

const { Asset, List } = require('../../../types');

const { map, compose } = require('ramda');

/**
 * apply types to transformed data
 * transformResults :: (RawAssetInfo | null)[] -> List Asset
 */
module.exports = compose(List, map(Asset), map(transformAssetInfo));
