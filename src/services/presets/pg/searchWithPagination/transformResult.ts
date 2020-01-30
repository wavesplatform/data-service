import { compose, init, last, take } from 'ramda';

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

const createMeta = <Cursor, Request extends WithLimit, ResponseRaw>(
  serialize: CursorSerialization<Cursor, Request, ResponseRaw>['serialize']
) => (
  request: RequestWithCursor<Request, Cursor>,
  responsesRaw: ResponseRaw[]
): ResponseMeta => {
  const metaBuilder: ResponseMeta = {};
  const lastResponse = last(init(responsesRaw));
  if (typeof lastResponse !== 'undefined') {
    metaBuilder.isLastPage = responsesRaw.length < request.limit;
    metaBuilder.lastCursor = serialize(request, lastResponse);
  }
  return metaBuilder;
};

export const transformResults = <
  Cursor,
  Request extends WithLimit,
  ResponseRaw,
  ResponseTransformed extends Serializable<string, any>
>(
  transformDbResponse: (
    results: ResponseRaw,
    request?: RequestWithCursor<Request, Cursor>
  ) => ResponseTransformed,
  serialize: CursorSerialization<Cursor, Request, ResponseRaw>['serialize']
) => (
  responses: ResponseRaw[],
  request: RequestWithCursor<Request, Cursor>
): List<ResponseTransformed> => {
  const transformedData = compose(
    rs => rs.map(r => transformDbResponse(r, request)),
    take<ResponseRaw>(request.limit - 1)
  )(responses);

  return list(transformedData, createMeta(serialize)(request, responses));
};
