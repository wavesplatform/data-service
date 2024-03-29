import { of as taskOf } from 'folktale/concurrency/task';
import { Ok as ok, Error as error } from 'folktale/result';
import {
  AppError,
  ResolverError,
  DbError,
  Timeout,
} from '../../../../errorHandling';

import { search } from '../../createResolver';
import { ValidateSync } from '../types';
import { PgDriver } from '../../../../db/driver';

const ids = [
  'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
  '5ZUsD93EbK1SZZa2GXYZx3SjhcXWDvMKqzWoJZjNGkW8',
];
const errorMessage = 'Bad value';

// mock validation
const resultOk = (s: string) => ok<ResolverError, string>(s);
const resultError = (s: string) =>
  error<ResolverError, string>(AppError.Resolver(errorMessage));

const mockPgDriver: PgDriver = {
  many: (query: string) =>
    taskOf<DbError | Timeout, string[]>(query.split('::')),
} as PgDriver;

const commonConfig = {
  transformInput: ok,
  transformResult: (items: any) => ({
    isLastPage: false,
    items,
  }),
  getData: (ids: string[]) => mockPgDriver.many<string>(ids.join('::')),
  emitEvent: () => () => undefined,
};

const createMockResolver = (
  validateResult: ValidateSync<ResolverError, string>
) =>
  search<string[], string[], string, string>({
    ...commonConfig,
    validateResult,
  });

afterEach(() => jest.clearAllMocks());

describe('Resolver', () => {
  it('should return result if all validation pass', done => {
    const goodResolver = createMockResolver(resultOk);

    goodResolver(ids)
      .run()
      .listen({
        onResolved: data => {
          expect(data).toEqual({
            isLastPage: false,
            items: ids,
          });
          done();
        },
      });
  });

  it('should call db query is everything is ok', done => {
    const spiedDbQuery = jest.spyOn(mockPgDriver, 'many');
    const goodResolver = search<string[], string[], string, string>({
      ...commonConfig,
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

  it('should take left branch if output validation fails', done => {
    const badOutputResolver = createMockResolver(resultError);

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
