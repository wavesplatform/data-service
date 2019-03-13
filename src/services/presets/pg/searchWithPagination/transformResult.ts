import { fromNullable } from 'folktale/maybe';
import { last, objOf } from 'ramda';

import { NamedType } from '../../../../types/createNamedType';
import { encode, Cursor } from '../../../_common/pagination/cursor';
import { List, list } from '../../../../types';
import { RequestWithCursor, WithSortOrder } from '.';

const maybeLastItem = <ResponseTransformed>(data: ResponseTransformed[]) =>
  fromNullable(last(data));

const makeCursorFromLastData = <
  Request extends WithSortOrder,
  ResponseTransformed extends Record<string, any>
>(
  request: RequestWithCursor<Request, Cursor>,
  response: ResponseTransformed
): Cursor => ({
  timestamp: response.data.timestamp,
  id: response.data.id,
  sort: request.sort,
});

const createCursorMeta = <
  Request extends WithSortOrder,
  ResponseTransformed extends NamedType<string, any>
>(
  request: RequestWithCursor<Request, Cursor>,
  responses: ResponseTransformed[]
) =>
  maybeLastItem(responses)
    .map(lastItem => {
      lastItem.data ? {} : console.log('##########################################', lastItem);
      return encode(makeCursorFromLastData(request, lastItem));
    })
    .map(objOf('lastCursor'))
    .getOrElse({});

export const transformResults = <
  Request extends WithSortOrder,
  ResponseRaw,
  ResponseTransformed extends NamedType<string, any>
>(
  transformDbResponse: (
    results: ResponseRaw,
    request?: RequestWithCursor<Request, Cursor>
  ) => ResponseTransformed
) => (
  responses: ResponseRaw[],
  request: RequestWithCursor<Request, Cursor>
): List<ResponseTransformed> => {
  const transformedData = responses.map(response =>
    transformDbResponse(response, request)
  );

  return list(transformedData, createCursorMeta(request, transformedData));
};
