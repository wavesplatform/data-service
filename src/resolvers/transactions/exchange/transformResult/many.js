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
  propEq,
  last,
  head,
  prop,
} = require('ramda');

const Cursor = require('../pagination/cursor');
const getItem = pipe(
  ifElse(
    request => propEq('sort', 'desc')(request),
    (_, items) => last(items),
    (_, items) => head(items)
  ),
  prop('data')
);
const createCursorMeta = pipe(
  (request, xs) => [request.sort, getItem(request, xs)],
  ([sort, x]) => Cursor.encode(sort, x),
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
