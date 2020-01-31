import { compose, init, last, take } from 'ramda';

import { SearchedItems } from '../../../../../types';
import { WithLimit } from '../../../../_common';
import { RequestWithCursor, CursorSerialization } from '../../../pagination';

type ResponseMeta = {
  isLastPage: boolean;
  lastCursor?: string;
};

const createMeta = <
  Cursor,
  Request extends RequestWithCursor<WithLimit, string>,
  ResponseRaw
>(
  serialize: CursorSerialization<Cursor, Request, ResponseRaw>['serialize']
) => (request: Request, responsesRaw: ResponseRaw[]): ResponseMeta => {
  const metaBuilder: ResponseMeta = {
    isLastPage: true,
  };
  const lastResponse = last(init(responsesRaw));
  if (typeof lastResponse !== 'undefined') {
    metaBuilder.isLastPage = responsesRaw.length < request.limit;
    metaBuilder.lastCursor = serialize(request, lastResponse);
  }
  return metaBuilder;
};

export const transformResults = <
  Cursor,
  Request extends RequestWithCursor<WithLimit, string>,
  ResponseRaw,
  ResponseTransformed
>(
  transformDbResponse: (
    results: ResponseRaw,
    request?: Request
  ) => ResponseTransformed,
  serialize: CursorSerialization<Cursor, Request, ResponseRaw>['serialize']
) => (
  responses: ResponseRaw[],
  request: Request
): SearchedItems<ResponseTransformed> => {
  const transformedData = compose(
    rs => rs.map(r => transformDbResponse(r, request)),
    take<ResponseRaw>(request.limit - 1)
  )(responses);

  return {
    items: transformedData,
    ...createMeta(serialize)(request, responses),
  };
};
