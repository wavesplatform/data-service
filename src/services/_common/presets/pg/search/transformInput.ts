import { omit, compose, evolve, inc } from 'ramda';

import { WithLimit } from '../../../../_common';
import { RequestWithCursor, CursorSerialization } from '../../../pagination';

// @todo: should return Result<ValidationError, RequestWithCursor<Request, Cursor>> cause cursor deserialization
export const transformInput = <Cursor, Request extends WithLimit>(
  deserialize: CursorSerialization<Cursor, Request, Response>['deserialize']
) => (
  request: RequestWithCursor<Request, string>
): RequestWithCursor<Request, Cursor> => {
  const requestWithoutAfter = compose<
    RequestWithCursor<Request, string>,
    any, // hack for evolve output -> omit input type
    Request
  >(
    omit(['after']),
    evolve({ limit: inc })
  )(request);

  if (!request.after) {
    return requestWithoutAfter;
  } else {
    return {
      ...requestWithoutAfter,
      after: deserialize(request.after).unsafeGet(),
    };
  }
};
