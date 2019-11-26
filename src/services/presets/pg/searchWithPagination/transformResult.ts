import { compose, last, take } from 'ramda';

import { Serializable, List, list } from '../../../../types';
import { WithLimit } from '../../../_common';
import {
  RequestWithCursor,
  CursorSerialization,
} from '../../../_common/pagination';

type ResponseMeta = {
  isLastPage?: boolean;
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
  const metaBuilder: ResponseMeta = {};
  if (typeof lastTransformedResponse !== 'undefined') {
    metaBuilder.isLastPage = responsesRaw.length < request.limit;
    metaBuilder.lastCursor = serialize(request, lastTransformedResponse);
  }
  return metaBuilder;
};

export const transformResults = <
  Cursor extends Record<string, any>,
  Request extends WithLimit,
  ResponseRaw,
  ResponseTransformed extends Serializable<string, any>
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
): List<ResponseTransformed> => {
  const transformedData = compose(
    rs => rs.map(r => transformDbResponse(r, request)),
    take<ResponseRaw>(request.limit - 1)
  )(responses);

  return list(
    transformedData,
    createMeta(serialize)(request, responses, last(transformedData))
  );
};
