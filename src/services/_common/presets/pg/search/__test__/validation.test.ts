import { of as task } from 'folktale/concurrency/task';
import { Result, Error as error, Ok as ok } from 'folktale/result';
import { always, identity, T } from 'ramda';

import { parseDate } from '../../../../../../utils/parseDate';
import { Joi } from '../../../../../../utils/validation';
import { PgDriver } from '../../../../../../db/driver';
import { SortOrder, WithLimit } from '../../../..';
import { searchPreset } from '../../search';
import { AppError, ValidationError } from '../../../../../../errorHandling';
import { SearchedItems } from 'types';

const mockTxs: ResponseRaw[] = [
  { id: 'q', timestamp: new Date() },
  { id: 'w', timestamp: new Date() },
];

type Request = WithLimit & {
  timeEnd?: Date;
  timeStart?: Date;
  sort: SortOrder;
};

type ResponseRaw = {
  id: string;
  timestamp: Date;
};

type Cursor = {
  timestamp: Date;
  id: string;
};

const serialize = (
  request: Request,
  response: ResponseRaw
): string | undefined =>
  response === null
    ? undefined
    : Buffer.from(
        `${response.timestamp.toISOString()}::${response.id}`
      ).toString('base64');

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
        d.length > 1
          ? ok<ValidationError, string[]>(d)
          : error<ValidationError, string[]>(err('Cursor length <2'))
      )
      .chain(d =>
        parseDate(d[0]).map(date => ({
          timestamp: date,
          id: d[1],
        }))
      )
  );
};

const service = searchPreset<Cursor, Request, ResponseRaw, ResponseRaw>({
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

const assertValidationError = (done: jest.DoneCallback, v: Request) =>
  service(v)
    .run()
    .promise()
    .then(() => done('Wrong branch, error'))
    .catch((e: AppError) => {
      expect(e.type).toBe('Validation');
      done();
    });

describe('search preset validation', () => {
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
          onResolved: (x: SearchedItems<any>) => {
            expect(x.items).toBeInstanceOf(Array);
            done();
          },
        }));
  });
});
