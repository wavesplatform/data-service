import { Result, Error as error, Ok as ok } from 'folktale/result';
import { Transaction } from '../../../types';
import { ValidationError } from '../../../errorHandling';
import { parseDate } from '../../../utils/parseDate';
import { SortOrder, WithSortOrder } from '../../_common';

const isSortOrder = (s: string): s is SortOrder =>
  s === SortOrder.Ascending || s === SortOrder.Descending;

export type Cursor = {
  timestamp: Date;
  id: string;
  sort: SortOrder;
};

export const serialize = <
  Request extends WithSortOrder,
  ResponseTransformed extends Transaction
>(
  request: Request,
  response: ResponseTransformed
): string | undefined =>
  response.data === null
    ? undefined
    : Buffer.from(
        `${response.data.timestamp.toISOString()}::${response.data.id}::${
          request.sort
        }`
      ).toString('base64');

export const deserialize = (
  cursor: string
): Result<ValidationError, Cursor> => {
  const data = Buffer.from(cursor, 'base64')
    .toString('utf8')
    .split('::');

  const err = (message?: string) =>
    new ValidationError('Cursor deserialization is failed', { cursor, message });

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
