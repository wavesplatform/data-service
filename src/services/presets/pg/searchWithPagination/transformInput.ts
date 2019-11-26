import { omit, compose, evolve, inc } from 'ramda';

import { WithLimit } from '../../../_common';
import {
  RequestWithCursor,
  CursorSerialization,
} from '../../../_common/pagination';

const decodeAfter = <Cursor, Request, Response>(
  deserialize: CursorSerialization<Cursor, Request, Response>['deserialize']
) => (cursorString: string) =>
  deserialize(cursorString).matchWith({
    Ok: ({ value }) => value,
    Error: () => ({}),
  });

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
      after: decodeAfter(deserialize)(request.after),
    };
  }
};
