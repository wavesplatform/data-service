import { Result, Error as error, Ok as ok } from 'folktale/result';
import { ValidationError } from '../../../errorHandling';
import { SortOrder } from '../';

const isSortOrder = (s: string): s is SortOrder =>
  s === SortOrder.Ascending || s === SortOrder.Descending;

export type Cursor = {
  uid: number;
  sort: SortOrder;
};

export const encode = (cursor: Cursor): string =>
  Buffer.from(`${cursor.uid}::${cursor.sort}`).toString('base64');

export const decode = (cursor: string): Result<ValidationError, Cursor> => {
  const data = Buffer.from(cursor, 'base64')
    .toString('utf8')
    .split('::');

  const err = (message?: string) =>
    new ValidationError('Cursor decode is failed', { cursor, message });

  return (
    ok<ValidationError, string[]>(data)
      // validate length
      .chain(d =>
        d.length === 2
          ? ok<ValidationError, string[]>(d)
          : error<ValidationError, string[]>(
              err('Cursor length not equal to 2')
            )
      )
      .chain(d => {
        const s = d[1];
        if (isSortOrder(s)) {
          return ok<ValidationError, [string, SortOrder]>([d[0], s]);
        } else {
          return error<ValidationError, [string, SortOrder]>(
            err('Sort is not valid')
          );
        }
      })
      .map(([uid, sort]) => ({
        uid: parseInt(uid),
        sort,
      }))
  );
};
