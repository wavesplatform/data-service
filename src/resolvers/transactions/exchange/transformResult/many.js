const { transformTx } = require('./common');

const { Transaction, List, fromMaybe } = require('../../../../types');

const { map, compose } = require('ramda');

const { cursorHashFn } = require('../pagination/cursor');

/** transformResults :: (Maybe RawTxInfo)[] -> List Tx */
const transformResults = (result, request) =>
  compose(
    xs => List(xs, cursorHashFn(request)),
    map(fromMaybe(Transaction)),
    map(map(transformTx))
  )(result);

module.exports = transformResults;
