import { WithSortOrder } from '../';

export type RequestWithCursor<Request, CursorType> = Request & {
  after?: CursorType;
};

export type Cursorable = WithSortOrder;
