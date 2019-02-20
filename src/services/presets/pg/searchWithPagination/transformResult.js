const Maybe = require('folktale/maybe');

const { Transaction, list } = require('../../../../types');

const { map, compose, pipe, last, prop, objOf } = require('ramda');
const Cursor = require('../../../_common/pagination/cursor');

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

// @todo parameterize output type
/** transformResults :: RawTxsInfo[] -> List Transaction */
const transformResults = transformTxInfo => (result, request) =>
  compose(
    xs => list(xs, createCursorMeta(request, xs)),
    map(Transaction),
    map(transformTxInfo)
  )(result);

module.exports = transformResults;
