const { transformAssetInfo } = require('./common');

const { Asset } = require('../../../types');

const { head, compose, isNil, cond, T, identity } = require('ramda');

module.exports = compose(
  cond([[isNil, identity], [T, compose(Asset, transformAssetInfo)]]),
  head
);
