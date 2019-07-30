import { WithSortOrder } from '../';
export { Cursor } from './cursor';

export type RequestWithCursor<
  Request extends WithSortOrder,
  CursorType
> = Request & {
  after?: CursorType;
};
