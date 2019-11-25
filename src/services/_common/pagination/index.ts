import { Result } from 'folktale/result';
import { ValidationError } from '../../../errorHandling';

export type CursorEncode<Request, Res> = (
  request: Request,
  response: Res
) => string | undefined;

export type CursorDecode<Cursor> = (
  cursor: string
) => Result<ValidationError, Cursor>;

export type CursorSerialization<Cursor, Request, Res> = {
  encode: CursorEncode<Request, Res>;
  decode: CursorDecode<Cursor>;
};

export type RequestWithCursor<Request, CursorType> = Request & {
  after?: CursorType;
};
