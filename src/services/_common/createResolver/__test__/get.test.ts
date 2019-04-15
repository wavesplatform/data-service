import { of as taskOf } from 'folktale/concurrency/task';
import { of as maybeOf } from 'folktale/maybe';
import { Ok, Error as error, Result } from 'folktale/result';
import { identity } from 'ramda';
import {
  AppError,
  ValidationError,
  ResolverError,
  DbError,
} from '../../../../errorHandling/';

import { get } from '../';
import { PgDriver } from '../../../../db/driver';

const assetId = 'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH';

// mock validation
const inputOk = (s: string) => Ok<ValidationError, string>(s);
const inputError = (s: string) =>
  error<ValidationError, string>(AppError.Validation(s));
const resultOk = (s: string) => Ok<ResolverError, string>(s);
const resultError = (s: string) =>
  error<ResolverError, string>(AppError.Resolver(s));

afterEach(() => jest.clearAllMocks());

describe('Resolver', () => {
  const commonConfig = {
    transformInput: identity,
    transformResult: identity,
    dbQuery: (driver: PgDriver) => (id: string) =>
      driver.one<string>(id).map(maybeOf),
  };

  const mockPgDriver: PgDriver = {
    one: (s: string) => taskOf<DbError, string>(s),
  } as PgDriver;

  const createMockResolver = (
    validateInput: (s: string) => Result<ValidationError, string>,
    validateResult: (s: string) => Result<ResolverError, string>
  ) =>
    get<PgDriver, string, string, string, string>({
      ...commonConfig,
      validateInput,
      validateResult,
    })({ db: mockPgDriver });

  it('should return result if all validation pass', done => {
    const goodResolver = createMockResolver(inputOk, resultOk);

    goodResolver(assetId)
      .run()
      .listen({
        onResolved: data => {
          expect(data.getOrElse(null)).toEqual(assetId);
          done();
        },
      });
  });

  it('should call db query if everything is ok', done => {
    const spiedDbQuery = jest.spyOn(mockPgDriver, 'one');

    const goodResolver = get({
      ...commonConfig,
      validateInput: inputOk,
      validateResult: resultOk,
    })({ db: mockPgDriver });

    goodResolver(assetId)
      .run()
      .listen({
        onResolved: () => {
          expect(spiedDbQuery).toBeCalled();
          done();
        },
      });
  });

  it('should emit events with correct values if everything is ok', done => {
    // emitEvent('RESOLVE')(payload)
    const innerSpy = jest.fn();
    const outerSpy = jest.fn((eventName: string) => (payload: any) =>
      innerSpy(eventName, payload)
    );

    const goodResolver = get({
      ...commonConfig,
      validateInput: inputOk,
      validateResult: resultOk,
    })({ db: mockPgDriver, emitEvent: outerSpy });

    goodResolver(assetId)
      .run()
      .listen({
        onResolved: () => {
          expect(innerSpy.mock.calls).toEqual([
            [
              'INPUT_VALIDATION_OK',
              'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
            ],
            [
              'TRANSFORM_INPUT_OK',
              'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
            ],
            [
              'DB_QUERY_OK',
              maybeOf('G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH'),
            ],
            [
              'RESULT_VALIDATION_OK',
              maybeOf('G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH'),
            ],
            [
              'TRANSFORM_RESULT_OK',
              maybeOf('G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH'),
            ],
          ]);

          done();
        },
      });
  });

  it('should take left branch if input validation fails', done => {
    const badInputResolver = createMockResolver(inputError, resultOk);

    badInputResolver(assetId)
      .run()
      .listen({
        onRejected: error => {
          expect(error).toEqual(AppError.Validation(assetId));
          done();
        },
      });
  });

  it('should NOT call db query if input validation fails', done => {
    const spiedDbQuery = jest.spyOn(mockPgDriver, 'one');
    const badInputResolver = get({
      ...commonConfig,
      validateInput: inputError,
      validateResult: resultOk,
    })({ db: mockPgDriver });

    badInputResolver(assetId)
      .run()
      .listen({
        onRejected: () => {
          expect(spiedDbQuery).not.toBeCalled();
          done();
        },
      });
  });

  it('should take left branch if output validation fails', done => {
    const badOutputResolver = createMockResolver(inputOk, resultError);

    badOutputResolver(assetId)
      .run()
      .listen({
        onRejected: e => {
          expect(e).toEqual(AppError.Resolver(assetId));
          done();
        },
      });
  });
});
