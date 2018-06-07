const { transformTx } = require('./common');

const { Transaction, List, fromMaybe } = require('../../../../types');

const {
  map,
  compose,
  ifElse,
  always,
  objOf,
  pipe,
  isNil,
  last,
  prop,
} = require('ramda');

const Cursor = require('../pagination/cursor');
const lastItem = pipe(
  last,
  prop('data')
);
const createCursorMeta = pipe(
  (request, xs) => Cursor.encode(request.sort, lastItem(xs)),
  ifElse(isNil, always({}), objOf('lastCursor'))
);

/** transformResults :: (Maybe RawTxInfo)[] -> List Tx */
const transformResults = (result, request) =>
  compose(
    xs => List(xs, createCursorMeta(request, xs)),
    map(fromMaybe(Transaction)),
    map(map(transformTx))
  )(result);

module.exports = transformResults;
