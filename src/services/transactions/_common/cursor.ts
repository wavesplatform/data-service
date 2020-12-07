import { Result, Error as error, Ok as ok } from 'folktale/result';
import { BigNumber } from '@waves/data-entities';
import { ValidationError } from '../../../errorHandling';
import { SortOrder, WithSortOrder } from '../../_common';
import { WithTxUid } from './types';

const isSortOrder = (s: string): s is SortOrder =>
  s === SortOrder.Ascending || s === SortOrder.Descending;

export type Cursor = {
  uid: BigNumber;
  sort: SortOrder;
};

export const serialize = <
  Request extends WithSortOrder,
  Response extends WithTxUid
>(
  request: Request,
  response: Response
): string | undefined =>
  response === null
    ? undefined
    : Buffer.from(`${response.uid.toString()}::${request.sort}`).toString(
        'base64'
      );

export const deserialize = (
  cursor: string
): Result<ValidationError, Cursor> => {
  const data = Buffer.from(cursor, 'base64').toString('utf8').split('::');

  const err = (message?: string) =>
    new ValidationError('Cursor deserialization is failed', {
      cursor,
      message,
    });

  return (
    ok<ValidationError, string[]>(data)
      // validate length
      .chain((d) =>
        d.length === 2
          ? ok<ValidationError, string[]>(d)
          : error<ValidationError, string[]>(
              err('Cursor length is not equals to 2')
            )
      )
      .chain((d) => {
        const s = d[1];
        if (isSortOrder(s)) {
          return ok<ValidationError, [BigNumber, SortOrder]>([
            new BigNumber(d[0]),
            s,
          ]);
        } else {
          return error<ValidationError, [BigNumber, SortOrder]>(
            err('Sort is not valid')
          );
        }
      })
      .map(([uid, sort]) => ({
        uid,
        sort,
      }))
  );
};
