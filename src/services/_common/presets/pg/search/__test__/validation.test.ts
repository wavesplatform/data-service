import { of as task } from 'folktale/concurrency/task';
import { Result, Error as error, Ok as ok } from 'folktale/result';
import { always, identity, T } from 'ramda';

import { PgDriver } from '../../../../../../db/driver';
import { AppError, ValidationError } from './../../../../../../errorHandling';
import { SearchedItems } from '../../../../../../types';
import { Joi } from '../../../../../../utils/validation';
import { RequestWithCursor } from '../../../../../_common/pagination';
import { WithLimit, WithSortOrder, SortOrder } from '../../../..';
import { searchPreset } from '../../search';

const mockTxs: ResponseRaw[] = [
  { tx_uid: 1, id: 'q', timestamp: new Date() },
  { tx_uid: 2, id: 'w', timestamp: new Date() },
];

type ResponseRaw = {
  tx_uid: number;
  id: string;
  timestamp: Date;
};

type Cursor = {
  tx_uid: number;
};

const serialize = (
  request: RequestWithCursor<WithLimit, string>,
  response: ResponseRaw
): string | undefined =>
  response === null
    ? undefined
    : Buffer.from(response.tx_uid.toString()).toString('base64');

const deserialize = (cursor: string): Result<ValidationError, Cursor> => {
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
        d.length === 1
          ? ok<ValidationError, number>(parseInt(d[0]))
          : error<ValidationError, number>(
              err('Cursor length is not equals to 1')
            )
      )
      .map(tx_uid => ({
        tx_uid,
      }))
  );
};

const service = searchPreset<
  Cursor,
  RequestWithCursor<WithLimit & WithSortOrder, string>,
  ResponseRaw,
  ResponseRaw
>({
  name: 'some_name',
  sql: () => '',
  resultSchema: Joi.any(),
  transformResult: identity,
  cursorSerialization: {
    serialize,
    deserialize,
  },
})({
  pg: { any: filters => task(mockTxs) } as PgDriver,
  emitEvent: always(T),
});

describe('search preset validation', () => {
  describe('common filters', () => {
    it('passes if correct object is provided', done =>
      service({
        limit: 1,
        sort: SortOrder.Descending,
      })
        .run()
        .listen({
          onResolved: (x: SearchedItems<any>) => {
            expect(x.items).toBeInstanceOf(Array);
            done();
          },
          onRejected: (e: AppError) => {
            done(e.error.message);
          },
        }));
  });
});
