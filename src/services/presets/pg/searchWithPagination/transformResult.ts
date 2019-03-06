import { fromNullable } from 'folktale/maybe';
import { map, compose, last, prop, objOf } from 'ramda';

import { NamedType } from '../../../../types/createNamedType';
// const { transaction, list } = require('../../../../types');
import {
  decode,
  encode,
  SortAscend,
  SortDescend,
  Cursor,
} from '../../../_common/pagination/cursor';

const lastItem = <T>(data: NamedType<string, T>[]) =>
  fromNullable(last(data)).map(prop('data'));

const createCursorMeta = <RequestRaw, T = Cursor>(
  request: RequestRaw & { after?: Cursor },
  xs: NamedType<string, T>[]
) =>
  lastItem(xs)
    .map(encode(request.after))
    .map(objOf('lastCursor'))
    .getOrElse({});

// @todo parameterize output type
/** transformResults :: RawTxsInfo[] -> List Transaction */
export const transformResults = transformTxInfo => (result, request) =>
  compose(
    xs => list(xs, createCursorMeta(request, xs)),
    map(transaction),
    map(transformTxInfo)
  )(result);

module.exports = transformResults;
