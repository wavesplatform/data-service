import { decode, Cursor } from '../../../_common/pagination/cursor';
import { RequestWithCursor, WithSortOrder } from './index';
import { omit } from 'ramda';

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
  const requestWithoutAfter = omit(['after'], request) as Request;

  if (!request.after) {
    return requestWithoutAfter;
  } else {
    return {
      ...requestWithoutAfter,
      ...decodeAfter(request.after),
    };
  }
};
