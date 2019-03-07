import { Result, Error as error, Ok as ok } from 'folktale/result';
import { ValidationError } from '../../../errorHandling';

export type SortAscend = 'ask';
export type SortDescend = 'desc';

export type Cursor = {
  timestamp: Date;
  id: string;
  sort: string;
};

export const encode = (item: Cursor): string =>
  Buffer.from(
    `${item.timestamp.toISOString()}::${item.id}::${item.sort}`
  ).toString('base64');

export const decode = (cursor: string): Result<ValidationError, Cursor> => {
  const data = Buffer.from(cursor, 'base64')
    .toString('utf8')
    .split('::');

  if (data.length > 2) {
    const date = Date.parse(data[0]);
    if (!isNaN(date)) {
      return ok({
        timestamp: new Date(date),
        id: data[1],
        sort: data[2],
      });
    }
  }

  return error(new ValidationError('Cursor decode is failed', { cursor }));
};
