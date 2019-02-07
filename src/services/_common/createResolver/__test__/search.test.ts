import { of as taskOf } from 'folktale/concurrency/task';
import { Ok, Error as error } from 'folktale/result';
import { identity } from 'ramda';
import {
  AppError,
  ValidationError,
  ResolverError,
  DbError,
} from '../../../../errorHandling/';

import { search } from '..';
import { Validate } from '../types';
import { PgDriver } from '../../../../db/driver';

const ids = [
  'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
  '5ZUsD93EbK1SZZa2GXYZx3SjhcXWDvMKqzWoJZjNGkW8',
];
const errorMessage = 'Bad value';

// mock validation
const inputOk = (s: string[]) => Ok<ValidationError, string[]>(s);
const inputError = (s: string[]) =>
  error<ValidationError, string[]>(AppError.Validation(errorMessage));
const resultOk = (s: string) => Ok<ResolverError, string>(s);
const resultError = (s: string) =>
  error<ResolverError, string>(AppError.Resolver(errorMessage));

const mockPgDriver: PgDriver = {
  many: (query: string) => taskOf<DbError, string[]>(query.split('::')),
} as PgDriver;

const commonConfig = {
  transformInput: identity,
  transformResult: identity,
  dbQuery: (driver: PgDriver) => (ids: string[]) =>
    driver.many<string>(ids.join('::')),
};

const createMockResolver = (
  validateInput: Validate<ValidationError, string[]>,
  validateResult: Validate<ResolverError, string>
) =>
  search<string[], string[], string, string[]>({
    ...commonConfig,
    validateInput,
    validateResult,
  })({ db: mockPgDriver });

afterEach(() => jest.clearAllMocks());

describe('Resolver', () => {
  it('should return result if all validation pass', done => {
    const goodResolver = createMockResolver(inputOk, resultOk);

    goodResolver(ids)
      .run()
      .listen({
        onResolved: (data: string[]) => {
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
    })({ db: mockPgDriver });

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
        onRejected: (e: AppError) => {
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
    })({ db: mockPgDriver });

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
        onRejected: (e: AppError) => {
          expect(e).toEqual(AppError.Resolver(errorMessage));
          done();
        },
      });
  });
});
