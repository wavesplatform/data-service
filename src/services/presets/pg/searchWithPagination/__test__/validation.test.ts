import { of as task } from 'folktale/concurrency/task';
import { Result, Error as error, Ok as ok } from 'folktale/result';
import { always, T } from 'ramda';

import { parseDate } from '../../../../../utils/parseDate';
import { Joi } from '../../../../../utils/validation';
import { Serializable, toSerializable } from '../../../../../types/serializable';
import { PgDriver } from '../../../../../db/driver';
import { SortOrder, WithLimit } from '../../../../_common';
import { RequestWithCursor } from '../../../../_common/pagination';
import { searchWithPaginationPreset } from '..';
import filterSchema from './filterSchema';
import { AppError, ValidationError } from './../../../../../errorHandling';

const mockTxs: ResponseRaw[] = [
  { id: 'q', timestamp: new Date() },
  { id: 'w', timestamp: new Date() },
];

type Request = RequestWithCursor<
  WithLimit & {
    timeStart: Date;
    timeEnd: Date;
    sort: SortOrder;
  },
  string
>;

type ResponseRaw = {
  id: string;
  timestamp: Date;
};

type Cursor = {
  timestamp: Date;
  id: string;
};

const serialize = <ResponseRaw extends Serializable<string, any>>(
  request: Request,
  response: ResponseRaw
): string | undefined =>
  response === null
    ? undefined
    : Buffer.from(
        `${response.data.timestamp.toISOString()}::${response.data.id}`
      ).toString('base64');

const deserialize = (cursor: string): Result<ValidationError, Cursor> => {
  const data = Buffer.from(cursor, 'base64').toString('utf8').split('::');

  const err = (message?: string) =>
    new ValidationError('Cursor deserialization is failed', { cursor, message });

  return (
    ok<ValidationError, string[]>(data)
      // validate length
      .chain((d) =>
        d.length > 1
          ? ok<ValidationError, string[]>(d)
          : error<ValidationError, string[]>(err('Cursor length <2'))
      )
      .chain((d) =>
        parseDate(d[0]).map((date) => ({
          timestamp: date,
          id: d[1],
        }))
      )
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
  inputSchema: filterSchema(deserialize),
  resultSchema: Joi.any(),
  transformResult: (response: ResponseRaw) =>
    toSerializable<'tx', ResponseRaw>('tx', response),
  cursorSerialization: {
    serialize,
    deserialize,
  },
})({
  pg: { any: (filters) => task(mockTxs) } as PgDriver,
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
    it('fails if timeEnd < 0', (done) =>
      assertValidationError(done, {
        timeStart: parseDate('1525132800000').unsafeGet(),
        timeEnd: parseDate('-1525132900000').unsafeGet(),
        limit: 10,
        sort: SortOrder.Ascending,
      }));
    it('fails if timeStart < 0', (done) =>
      assertValidationError(done, {
        timeEnd: parseDate('1525132900000').unsafeGet(),
        timeStart: parseDate('-1525132800000').unsafeGet(),
        limit: 10,
        sort: SortOrder.Ascending,
      }));
    it('fails if timeEnd < timeStart', (done) =>
      assertValidationError(done, {
        timeEnd: parseDate('1525132700000').unsafeGet(),
        timeStart: parseDate('1525132800000').unsafeGet(),
        limit: 10,
        sort: SortOrder.Ascending,
      }));
    it('fails if timeStart->invalid Date', (done) => {
      expect(parseDate('').unsafeGet).toThrowError();
      done();
    });
    it('passes if correct object is provided', (done) =>
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
          onRejected: (e) => done(e),
        }));
  });
});
