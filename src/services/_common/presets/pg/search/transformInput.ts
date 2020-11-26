import { Result, Ok as ok } from 'folktale/result';
import { omit, compose, evolve, inc } from 'ramda';

import { ValidationError } from '../../../../../errorHandling';
import { WithLimit } from '../../../../_common';
import { RequestWithCursor, CursorSerialization } from '../../../pagination';

export const transformInput = <Cursor, Request extends WithLimit>(
  deserialize: CursorSerialization<Cursor, Request, Response>['deserialize']
) => (
  request: RequestWithCursor<Request, string>
): Result<ValidationError, RequestWithCursor<Request, Cursor>> => {
  const requestWithoutAfter = compose<
    RequestWithCursor<Request, string>,
    any, // hack for evolve output -> omit input type
    Request
  >(
    omit(['after']),
    evolve({ limit: inc })
  )(request);

  if (!request.after) {
    return ok(requestWithoutAfter);
  } else {
    return deserialize(request.after).map(cursor => ({
      ...requestWithoutAfter,
      after: cursor,
    }));
  }
};
