import { omit, compose, evolve, inc } from 'ramda';

import { WithLimit } from '../../../_common';
import {
  RequestWithCursor,
  CursorSerialization,
} from '../../../_common/pagination';

export const transformInput = <Cursor, Request extends WithLimit>(
  deserialize: CursorSerialization<Cursor, Request, Response>['deserialize']
) => (
  request: RequestWithCursor<Request, string>
): RequestWithCursor<Request, Cursor> => {
  const requestWithoutAfter = compose<
    RequestWithCursor<Request, string>,
    any, // hack for evolve output -> omit input type
    RequestWithCursor<Request, Cursor>
  >(
    omit(['after']),
    evolve({ limit: inc })
  )(request) as Request;

  if (!request.after) {
    return requestWithoutAfter;
  } else {
    return {
      ...requestWithoutAfter,
      after: deserialize(request.after).getOrElse(undefined),
    };
  }
};
