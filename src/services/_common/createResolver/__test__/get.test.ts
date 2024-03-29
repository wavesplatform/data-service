import { of as taskOf } from 'folktale/concurrency/task';
import { of as maybeOf } from 'folktale/maybe';
import { Ok as ok, Error as error } from 'folktale/result';
import { identity } from 'ramda';
import {
  AppError,
  ValidationError,
  ResolverError,
  DbError,
  Timeout,
} from '../../../../errorHandling';

import { get } from '..';
import { PgDriver } from '../../../../db/driver';
import { ValidateAsync, ValidateSync } from '../types';

const assetId = 'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH';

// mock validation
const inputOk = (s: string) => taskOf<ValidationError, string>(s);
const resultOk = (s: string) => ok<ResolverError, string>(s);
const resultError = (s: string) =>
  error<ResolverError, string>(AppError.Resolver(s));

afterEach(() => jest.clearAllMocks());

describe('Resolver', () => {
  const mockPgDriver: PgDriver = {
    one: (s: string) => taskOf<DbError | Timeout, string>(s),
  } as PgDriver;

  const commonConfig = {
    transformInput: ok,
    transformResult: identity,
    getData: (id: string) => mockPgDriver.one<string>(id).map(maybeOf),
    emitEvent: () => () => undefined,
  };

  const createMockResolver = (
    validateInput: ValidateAsync<ValidationError, string>,
    validateResult: ValidateSync<ResolverError, string>
  ) =>
    get<string, string, string, string>({
      ...commonConfig,
      validateResult,
    });

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

    const goodResolver = get<string, string, string, string>({
      ...commonConfig,
      validateResult: resultOk,
    });

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

    const goodResolver = get<string, string, string, string>({
      ...commonConfig,
      validateResult: resultOk,
      emitEvent: outerSpy,
    });

    goodResolver(assetId)
      .run()
      .listen({
        onResolved: () => {
          expect(innerSpy.mock.calls).toEqual([
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
