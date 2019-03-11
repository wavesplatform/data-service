import { fromNullable } from 'folktale/maybe';
import { last, objOf } from 'ramda';

import { NamedType } from '../../../../types/createNamedType';
import { encode, Cursor } from '../../../_common/pagination/cursor';
import { List, list } from '../../../../types';
import { RequestTransformed as RequestTransformedWithCursor } from '.';

const maybeLastItem = <ResponseTransformed>(data: ResponseTransformed[]) =>
  fromNullable(last(data));

const makeCursorFromLastData = <
  Request,
  ResponseTransformed extends NamedType<string, any>
>(
  request: RequestTransformedWithCursor<Request>,
  item: ResponseTransformed
): Cursor => ({
  timestamp: item.data ? item.data.timestamp : new Date(),
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
  transformDbResponse: (
    results: ResponseRaw,
    request?: RequestTransformedWithCursor<Request>
  ) => ResponseTransformed
) => (
  responses: ResponseRaw[],
  request: RequestTransformedWithCursor<Request>
): List<ResponseTransformed> => {
  const transformedData = responses.map(response =>
    transformDbResponse(response, request)
  );

  return list(transformedData, createCursorMeta(request, transformedData));
};
