import { omit, compose, evolve, inc } from 'ramda';
import { Result } from 'folktale/result';

import { WithLimit } from '../../../_common';
import { RequestWithCursor } from '../../../_common/pagination';
import { ValidationError } from 'errorHandling';

const decodeAfter = <Cursor>(
  decode: (cursor: string) => Result<ValidationError, Cursor>
) => (cursorString: string) =>
  decode(cursorString).matchWith({
    Ok: ({ value }) => value,
    Error: () => ({}),
  });

export const transformInput = <Cursor, Request extends WithLimit>(
  decode: (cursor: string) => Result<ValidationError, Cursor>
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
      ...decodeAfter(decode)(request.after),
    };
  }
};
