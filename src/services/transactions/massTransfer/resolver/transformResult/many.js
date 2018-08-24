const Maybe = require('folktale/maybe');
const { transformTxInfo } = require('./common');

const { Transaction, List, fromMaybe } = require('../../../../../types');

const { map, compose, pipe, last, prop, objOf } = require('ramda');

const Cursor = require('../../../../../resolvers/pagination/cursor');
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

/** transformResults :: (Maybe RawTxsInfo)[] -> List Transaction */
const transformResults = (result, request) =>
  compose(
    xs => List(xs, createCursorMeta(request, xs)),
    map(fromMaybe(Transaction)),
    map(map(transformTxInfo))
  )(result);

module.exports = transformResults;
