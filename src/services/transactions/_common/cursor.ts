import { Result, Error as error, Ok as ok } from 'folktale/result';
import { ValidationError } from '../../../errorHandling';
import { SortOrder, WithSortOrder } from '../../_common';
import { RawTxWithUid } from './types';

const isSortOrder = (s: string): s is SortOrder =>
  s === SortOrder.Ascending || s === SortOrder.Descending;

export type Cursor = {
  tx_uid: number;
  sort: SortOrder;
};

export const serialize = <
  Request extends WithSortOrder,
  Response extends RawTxWithUid
>(
  request: Request,
  response: Response
): string | undefined =>
  response === null
    ? undefined
    : Buffer.from(`${response.tx_uid}::${request.sort}`).toString('base64');

export const deserialize = (
  cursor: string
): Result<ValidationError, Cursor> => {
  const data = Buffer.from(cursor, 'base64')
    .toString('utf8')
    .split('::');

  const err = (message?: string) =>
    new ValidationError('Cursor deserialization is failed', {
      cursor,
      message,
    });

  return (
    ok<ValidationError, string[]>(data)
      // validate length
      .chain(d =>
        d.length === 2
          ? ok<ValidationError, string[]>(d)
          : error<ValidationError, string[]>(
              err('Cursor length is not equals to 2')
            )
      )
      .chain(d => {
        const s = d[1];
        if (isSortOrder(s)) {
          return ok<ValidationError, [number, SortOrder]>([parseInt(d[0]), s]);
        } else {
          return error<ValidationError, [number, SortOrder]>(
            err('Sort is not valid')
          );
        }
      })
      .map(([tx_uid, sort]) => ({
        tx_uid,
        sort,
      }))
  );
};
