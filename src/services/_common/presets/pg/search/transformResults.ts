import { compose, last, take } from 'ramda';

import { SearchedItems } from '../../../../../types';
import { WithLimit } from '../../../../_common';
import { RequestWithCursor, CursorSerialization } from '../../../pagination';

type ResponseMeta = {
  isLastPage: boolean;
  lastCursor?: string;
};

const createMeta = <
  Cursor extends Partial<Request> & Partial<ResponseTransformed>,
  Request extends WithLimit,
  ResponseRaw,
  ResponseTransformed
>(
  serialize: CursorSerialization<
    Cursor,
    Request,
    ResponseTransformed
  >['serialize']
) => (
  request: RequestWithCursor<Request, Cursor>,
  responsesRaw: ResponseRaw[],
  lastTransformedResponse: ResponseTransformed | undefined
): ResponseMeta => {
  const metaBuilder: ResponseMeta = {
    isLastPage: true,
  };
  if (typeof lastTransformedResponse !== 'undefined') {
    metaBuilder.isLastPage = responsesRaw.length < request.limit;
    metaBuilder.lastCursor = serialize(request, lastTransformedResponse);
  }
  return metaBuilder;
};

export const transformResults = <
  Cursor extends any,
  Request extends WithLimit,
  ResponseRaw,
  ResponseTransformed
>(
  transformDbResponse: (
    results: ResponseRaw,
    request?: RequestWithCursor<Request, Cursor>
  ) => ResponseTransformed,
  serialize: CursorSerialization<
    Cursor,
    Request,
    ResponseTransformed
  >['serialize']
) => (
  responses: ResponseRaw[],
  request: RequestWithCursor<Request, Cursor>
): SearchedItems<ResponseTransformed> => {
  const transformedData = compose(
    rs => rs.map(r => transformDbResponse(r, request)),
    take<ResponseRaw>(request.limit - 1)
  )(responses);

  return {
    items: transformedData,
    ...createMeta(serialize)(request, responses, last(transformedData)),
  };
};
