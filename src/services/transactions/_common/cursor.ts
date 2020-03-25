import { Result, Error as error, Ok as ok } from 'folktale/result';
import { ValidationError } from '../../../errorHandling';
import { SortOrder, WithSortOrder } from '../../_common';
import { WithHeight, WithPositionInBlock } from './types';

const isSortOrder = (s: string): s is SortOrder =>
  s === SortOrder.Ascending || s === SortOrder.Descending;

export type Cursor = {
  height: number;
  position_in_block: number;
  sort: SortOrder;
};

export const serialize = <
  Request extends WithSortOrder,
  Response extends WithHeight & WithPositionInBlock
>(
  request: Request,
  response: Response
): string | undefined =>
  response === null
    ? undefined
    : Buffer.from(
        `${response.height.toString()}::${response.position_in_block.toString()}::${
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
    new ValidationError('Cursor deserialization is failed', {
      cursor,
      message,
    });

  return (
    ok<ValidationError, string[]>(data)
      // validate length
      .chain(d =>
        d.length === 3
          ? ok<ValidationError, string[]>(d)
          : error<ValidationError, string[]>(
              err('Cursor length is not equals to 3')
            )
      )
      .chain(d => {
        const s = d[2];
        if (isSortOrder(s)) {
          return ok<ValidationError, [number, number, SortOrder]>([
            parseInt(d[0]),
            parseInt(d[1]),
            s,
          ]);
        } else {
          return error<ValidationError, [number, number, SortOrder]>(
            err('Sort is not valid')
          );
        }
      })
      .map(([height, position_in_block, sort]) => ({
        height,
        position_in_block,
        sort,
      }))
  );
};
