const { transformTx } = require('./common');

const { Transaction, List, fromMaybe } = require('../../../../types');
const Maybe = require('folktale/maybe');
const { map, compose, pipe, objOf, last, prop } = require('ramda');

const Cursor = require('../../../../resolvers/pagination/cursor');
const lastItem = pipe(
  last,
  prop('data'),
  Maybe.fromNullable
);

const createCursorMeta = (request, xs) =>
  lastItem(xs)
    .map(Cursor.encode(request.sort))
    .map(objOf('lastCursor'))
    .getOrElse({});

/** transformResults :: (Maybe RawTxInfo)[] -> List Tx */
const transformResults = (result, request) =>
  compose(
    xs => List(xs, createCursorMeta(request, xs)),
    map(fromMaybe(Transaction)),
    map(map(transformTx))
  )(result);

module.exports = transformResults;
