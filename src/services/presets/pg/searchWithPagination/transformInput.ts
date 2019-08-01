import { omit, compose, evolve, inc } from 'ramda';

import { WithSortOrder, WithLimit } from '../../../_common';
import { Cursor, RequestWithCursor } from '../../../_common/pagination';
import { decode } from '../../../_common/pagination/cursor';

const decodeAfter = (cursorString: string) =>
  decode(cursorString).matchWith({
    Ok: ({ value }) => ({
      after: value,
      sort: value.sort,
    }),
    Error: () => ({}),
  });

export const transformInput = <Request extends WithSortOrder & WithLimit>(
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
      ...decodeAfter(request.after),
    };
  }
};
