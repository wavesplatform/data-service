import { Result, Error as error, Ok as ok } from 'folktale/result';
import { ValidationError } from '../../../errorHandling';
import { parseDate } from '../../../utils/parseDate';
import { SortOrder } from '../';

const isSortOrder = (s: string): s is SortOrder =>
  s === SortOrder.Ascending || s === SortOrder.Descending;

export type Cursor = {
  timestamp: Date;
  id: string;
  sort: SortOrder;
};

export const encode = (cursor: Cursor): string =>
  Buffer.from(
    `${cursor.timestamp.toISOString()}::${cursor.id}::${cursor.sort}`
  ).toString('base64');

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
        d.length > 2
          ? ok<ValidationError, string[]>(d)
          : error<ValidationError, string[]>(err('Cursor length <3'))
      )
      .chain(d =>
        parseDate(d[0])
          .mapError(e => err())
          // validate sort order 'asc' | 'desc'
          .chain(date => {
            const s = d[2];
            if (isSortOrder(s)) {
              return ok<ValidationError, [Date, SortOrder]>([date, s]);
            } else {
              return error<ValidationError, [Date, SortOrder]>(
                err('Sort is not valid')
              );
            }
          })
          .map(([date, sort]) => ({
            timestamp: date,
            id: d[1],
            sort,
          }))
      )
  );
};
