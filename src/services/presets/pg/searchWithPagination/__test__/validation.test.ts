import { of as task } from 'folktale/concurrency/task';
import { Result, Error as error, Ok as ok } from 'folktale/result';
import { always, T } from 'ramda';

import { Joi } from '../../../../../utils/validation';
import {
  Serializable,
  toSerializable,
} from '../../../../../types/serializable';
import { PgDriver } from '../../../../../db/driver';
import { WithLimit } from '../../../../_common';
import { searchWithPaginationPreset } from '..';
import commonFilterSchemas from '../commonFilterSchemas';
import { AppError, ValidationError } from './../../../../../errorHandling';
import { RawTxWithUid } from '../../../../transactions/_common/types';
import { RequestWithCursor } from '../../../../_common/pagination';

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

const serialize = <ResponseRaw extends RawTxWithUid>(
  request: RequestWithCursor<WithLimit, Cursor>,
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

const service = searchWithPaginationPreset<
  Cursor,
  RequestWithCursor<WithLimit, string>,
  ResponseRaw,
  ResponseRaw,
  Serializable<string, ResponseRaw | null>
>({
  name: 'some_name',
  sql: () => '',
  inputSchema: Joi.object().keys(commonFilterSchemas(deserialize)),
  resultSchema: Joi.any(),
  transformResult: (response: ResponseRaw) =>
    toSerializable<'tx', ResponseRaw>('tx', response),
  cursorSerialization: {
    serialize,
    deserialize,
  },
})({
  pg: { any: filters => task(mockTxs) } as PgDriver,
  emitEvent: always(T),
});

const assertValidationError = (
  done: jest.DoneCallback,
  v: RequestWithCursor<WithLimit, string>
) =>
  service(v)
    .run()
    .promise()
    .then(() => done('Wrong branch, error'))
    .catch((e: AppError) => {
      expect(e.type).toBe('Validation');
      done();
    });

describe('searchWithPagination preset validation', () => {
  describe('common filters', () => {
    it('fails if limit <= 0', done =>
      assertValidationError(done, {
        limit: 0,
      }));
    it('passes if correct object is provided', done =>
      service({
        limit: 1,
      })
        .run()
        .listen({
          onResolved: (x: Serializable<string, any>) => {
            expect(x.__type).toBe('list');
            done();
          },
          onRejected: (e: AppError) => {
            done(e.error.message);
          },
        }));
  });
});
