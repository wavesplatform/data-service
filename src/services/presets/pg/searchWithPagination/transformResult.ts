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
import { List, list } from '../../../../types';
import { DataType } from '../../types';
import { RequestTransformed as RequestTransformedWithCursor } from '.';

const maybeLastItem = <ResponseTransformed>(data: ResponseTransformed[]) =>
  fromNullable(last(data));

const makeCursorFromLastData = <Request, ResponseTransformed>(
  item: ResponseTransformed extends NamedType<string, any>,
  request: RequestTransformedWithCursor<Request>
): Cursor => ({
  timestamp: item.data.timestamp,
  id: item.data.id,
  sort: request.sort,
});

const createCursorMeta = <
  Request,
  ResponseTransformed extends NamedType<string, any>
>(
  request: RequestTransformedWithCursor<Request>,
  responses: ResponseTransformed[]
) =>
  maybeLastItem(responses)
    .map(lastItem => encode(makeCursorFromLastData(request, lastItem)))
    .map(objOf('lastCursor'))
    .getOrElse({});

export const transformResults = <
  Request,
  ResponseRaw,
  ResponseTransformed extends NamedType<string, any>
>(
  typeFactory: (d?: DataType<ResponseTransformed>) => ResponseTransformed
) => (
  transformDbResponse: (
    results: ResponseRaw,
    request?: RequestTransformedWithCursor<Request>
  ) => DataType<ResponseTransformed>
) => (
  responses: ResponseRaw[],
  request: RequestTransformedWithCursor<Request>
): List<ResponseTransformed> => {
  const transformedData = responses.map(response =>
    typeFactory(transformDbResponse(response, request))
  );

  return list(transformedData, createCursorMeta(request, transformedData));
};
