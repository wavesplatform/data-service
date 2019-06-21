import { omit, compose, evolve, inc } from 'ramda';

import { decode, Cursor } from '../../../_common/pagination/cursor';
import { RequestWithCursor, WithSortOrder } from './index';

const decodeAfter = (cursorString: string) =>
  decode(cursorString).matchWith({
    Ok: ({ value }) => ({
      after: value,
      sort: value.sort,
    }),
    Error: () => ({}),
  });

export const transformInput = <Request extends WithSortOrder>(
  request: RequestWithCursor<Request, string>
): RequestWithCursor<Request, Cursor> => {
  const requestWithoutAfter = compose(
    omit(['after']),
    evolve({limit: inc})
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
