const Task = require('folktale/concurrency/task');
const Result = require('folktale/result');

const { identity } = require('ramda');

const create = require('..');

const ids = [
  'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
  '5ZUsD93EbK1SZZa2GXYZx3SjhcXWDvMKqzWoJZjNGkW8',
];

const ok = Result.Ok;
const notOk = Result.Error;

const mockDbQuery = ids => Task.of(ids);

const commonConfig = {
  transformResult: identity,
  dbQuery: identity,
};

const createMockResolver = (validateInput, validateResult) =>
  create.search({
    ...commonConfig,
    validateInput,
    validateResult,
  })({ db: mockDbQuery });

describe('Resolver', () => {
  it('should return result if all validation pass', done => {
    const goodResolver = createMockResolver(ok, ok);

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
    const spiedDbQuery = jest.fn(mockDbQuery);
    const goodResolver = create.search({
      ...commonConfig,
      validateInput: ok,
      validateResult: ok,
    })({ db: spiedDbQuery });

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
    const badInputResolver = createMockResolver(notOk, ok);

    badInputResolver(ids)
      .run()
      .listen({
        onRejected: data => {
          expect(data).toEqual(ids);
          done();
        },
      });
  });

  it('should NOT call db query if input validation fails', done => {
    const spiedDbQuery = jest.fn(mockDbQuery);
    const badInputResolver = create.search({
      ...commonConfig,
      validateInput: notOk,
      validateResult: ok,
    })({ db: spiedDbQuery });

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
    const badOutputResolver = createMockResolver(ok, notOk);

    badOutputResolver(ids)
      .run()
      .listen({
        onRejected: data => {
          expect(data).toEqual('G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH');
          done();
        },
      });
  });
});
