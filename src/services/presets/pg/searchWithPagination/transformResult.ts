import { fromNullable } from 'folktale/maybe';
import { last, objOf, dropLast } from 'ramda';

import { Serializable, List, list } from '../../../../types';
import { encode, Cursor } from '../../../_common/pagination/cursor';
import { RequestWithCursor, WithSortOrder, WithLimit } from '.';

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
  Request extends WithSortOrder & WithLimit,
  ResponseTransformed extends Serializable<string, any>
>(
  request: RequestWithCursor<Request, Cursor>,
  responses: ResponseTransformed[]
) =>
  maybeLastItem(responses)
    .map(lastItem => encode(makeCursorFromLastData(request, lastItem)))
    .map(objOf('lastCursor'))
    .getOrElse({});

export const transformResults = <
  Request extends WithSortOrder & WithLimit,
  ResponseRaw,
  ResponseTransformed extends Serializable<string, any>
>(
  transformDbResponse: (
    results: ResponseRaw,
    request?: RequestWithCursor<Request, Cursor>
  ) => ResponseTransformed
) => (
  responses: ResponseRaw[],
  request: RequestWithCursor<Request, Cursor>
): List<ResponseTransformed> => {
  const isLastPage = request.limit && responses.length < request.limit;
  const trimmedResponses = isLastPage ? responses : dropLast(1, responses);

  const transformedData = trimmedResponses.map(
    response => transformDbResponse(response, request)
  );

  const metadata = {
    ...createCursorMeta(request, transformedData),
    isLastPage,
  }

  return list(transformedData, metadata);
};
