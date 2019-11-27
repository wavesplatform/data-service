import { of as task } from 'folktale/concurrency/task';
import { Result, Error as error, Ok as ok } from 'folktale/result';
import { always, T } from 'ramda';

import { parseDate } from '../../../../../utils/parseDate';
import { Joi } from '../../../../../utils/validation';
import {
  Serializable,
  toSerializable,
} from '../../../../../types/serializable';
import { PgDriver } from '../../../../../db/driver';
import { SortOrder, WithLimit } from '../../../../_common';
import { searchWithPaginationPreset } from '..';
import commonFilterSchemas from '../commonFilterSchemas';
import { AppError, ValidationError } from './../../../../../errorHandling';
import { RawTxWithUid } from 'services/transactions/_common/types';

const mockTxs: ResponseRaw[] = [
  { tx_uid: 1, id: 'q', timestamp: new Date() },
  { tx_uid: 2, id: 'w', timestamp: new Date() },
];

type Request = WithLimit & {
  timeEnd?: Date;
  timeStart?: Date;
  sort: SortOrder;
};

type ResponseRaw = {
  tx_uid: number;
  id: string;
  timestamp: Date;
};

type Cursor = {
  tx_uid: number;
  sort: SortOrder;
};

const isSortOrder = (s: string): s is SortOrder =>
  s === SortOrder.Ascending || s === SortOrder.Descending;

const serialize = <ResponseRaw extends RawTxWithUid>(
  request: Request,
  response: ResponseRaw
): string | undefined =>
  response === null
    ? undefined
    : Buffer.from(`${response.tx_uid}::${request.sort}`).toString('base64');

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

const service = searchWithPaginationPreset<
  Cursor,
  Request,
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

const assertValidationError = (done: jest.DoneCallback, v: Request) =>
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
    it('fails if timeEnd < 0', done =>
      assertValidationError(done, {
        timeEnd: parseDate('-1525132900000').unsafeGet(),
        limit: 10,
        sort: SortOrder.Ascending,
      }));
    it('fails if timeStart < 0', done =>
      assertValidationError(done, {
        timeEnd: parseDate('1525132900000').unsafeGet(),
        timeStart: parseDate('-1525132800000').unsafeGet(),
        limit: 10,
        sort: SortOrder.Ascending,
      }));
    it('fails if timeEnd < timeStart', done =>
      assertValidationError(done, {
        timeEnd: parseDate('1525132700000').unsafeGet(),
        timeStart: parseDate('1525132800000').unsafeGet(),
        limit: 10,
        sort: SortOrder.Ascending,
      }));
    it('fails if timeStart->invalid Date', done => {
      expect(parseDate('').unsafeGet).toThrowError();
      done();
    });
    it('passes if correct object is provided', done =>
      service({
        timeStart: new Date(0),
        timeEnd: new Date(),
        limit: 1,
        sort: SortOrder.Ascending,
      })
        .run()
        .listen({
          onResolved: (x: Serializable<string, any>) => {
            expect(x.__type).toBe('list');
            done();
          },
        }));
  });
});
