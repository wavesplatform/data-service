import {
  of as taskOf,
  rejected as taskRejected,
} from 'folktale/concurrency/task';
import { Ok, Error as error } from 'folktale/result';
import { identity } from 'ramda';
import {
  AppError,
  ValidationError,
  ResolverError,
  DbError,
} from '../../../../errorHandling/';

import { search } from '..';
import { ValidateSync, ValidateAsync } from '../types';
import { PgDriver } from '../../../../db/driver';

const ids = [
  'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
  '5ZUsD93EbK1SZZa2GXYZx3SjhcXWDvMKqzWoJZjNGkW8',
];
const errorMessage = 'Bad value';

// mock validation
const inputOk = (s: string[]) => taskOf<ValidationError, string[]>(s);
const inputError = () =>
  taskRejected<ValidationError, string[]>(AppError.Validation(errorMessage));
const resultOk = (s: string) => Ok<ResolverError, string>(s);
const resultError = (s: string) =>
  error<ResolverError, string>(AppError.Resolver(errorMessage));

const mockPgDriver: PgDriver = {
  many: (query: string) => taskOf<DbError, string[]>(query.split('::')),
} as PgDriver;

const commonConfig = {
  transformInput: identity,
  transformResult: identity,
  getData: (ids: string[]) => mockPgDriver.many<string>(ids.join('::')),
  emitEvent: () => () => undefined,
};

const createMockResolver = (
  validateInput: ValidateAsync<ValidationError, string[]>,
  validateResult: ValidateSync<ResolverError, string>
) =>
  search<string[], string[], string, string[]>({
    ...commonConfig,
    validateInput,
    validateResult,
  });

afterEach(() => jest.clearAllMocks());

describe('Resolver', () => {
  it('should return result if all validation pass', done => {
    const goodResolver = createMockResolver(inputOk, resultOk);

    goodResolver(ids)
      .run()
      .listen({
        onResolved: data => {
          expect(data).toEqual(ids);
          done();
        },
      });
  });

  it('should call db query is everything is ok', done => {
    const spiedDbQuery = jest.spyOn(mockPgDriver, 'many');
    const goodResolver = search({
      ...commonConfig,
      validateInput: inputOk,
      validateResult: resultOk,
    });

    goodResolver(ids)
      .run()
      .listen({
        onResolved: () => {
          expect(spiedDbQuery).toBeCalled();
          done();
        },
      });
  });

  it('should take left branch if input validation fails', done => {
    const badInputResolver = createMockResolver(inputError, resultOk);

    badInputResolver(ids)
      .run()
      .listen({
        onRejected: e => {
          expect(e).toEqual(AppError.Validation(errorMessage));
          done();
        },
      });
  });

  it('should NOT call db query if input validation fails', done => {
    const spiedDbQuery = jest.spyOn(mockPgDriver, 'many');
    const badInputResolver = search({
      ...commonConfig,
      validateInput: inputError,
      validateResult: resultOk,
    });

    badInputResolver(ids)
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

    badOutputResolver(ids)
      .run()
      .listen({
        onRejected: e => {
          expect(e).toEqual(AppError.Resolver(errorMessage));
          done();
        },
      });
  });
});
