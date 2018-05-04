const Task = require('folktale/concurrency/task');
const Maybe = require('folktale/maybe');
const Result = require('folktale/result');
const { identity, prop, compose } = require('ramda');

const create = require('../');

const assetId = 'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH';

const ok = Result.Ok;
const notOk = Result.Error;

const mockDbQuery = compose(Task.of, Maybe.of);

const commonConfig = {
  transformResult: prop('value'),
  dbQuery: identity,
};

const createMockResolver = (validateInput, validateResult) =>
  create.one({
    ...commonConfig,
    validateInput,
    validateResult,
  })({ db: mockDbQuery });

describe('Resolver', () => {
  it('should return result if all validation pass', done => {
    const goodResolver = createMockResolver(ok, ok);

    goodResolver(assetId)
      .run()
      .listen({
        onResolved: data => {
          expect(data).toEqual(assetId);
          done();
        },
      });
  });

  it('should call db query if everything is ok', done => {
    const spiedDbQuery = jest.fn(mockDbQuery);
    const goodResolver = create.one({
      ...commonConfig,
      validateInput: ok,
      validateResult: ok,
    })({ db: spiedDbQuery });

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
    const outerSpy = jest.fn(eventName => payload =>
      innerSpy(eventName, payload)
    );

    const goodResolver = create.one({
      ...commonConfig,
      validateInput: ok,
      validateResult: ok,
    })({ db: mockDbQuery, emitEvent: outerSpy });

    goodResolver(assetId)
      .run()
      .listen({
        onResolved: () => {
          expect(innerSpy.mock.calls[0]).toEqual([
            'INPUT_VALIDATION_OK',
            'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
          ]);

          expect(innerSpy.mock.calls[1]).toEqual([
            'DB_QUERY_OK',
            Maybe.of('G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH'),
          ]);

          expect(innerSpy.mock.calls[2]).toEqual([
            'RESULT_VALIDATION_OK',
            Maybe.of('G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH'),
          ]);

          expect(innerSpy.mock.calls[3]).toEqual([
            'TRANSFORM_RESULT_OK',
            'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
          ]);

          done();
        },
      });
  });

  it('should take left branch if input validation fails', done => {
    const badInputResolver = createMockResolver(notOk, ok);

    badInputResolver(assetId)
      .run()
      .listen({
        onRejected: data => {
          expect(data).toEqual(assetId);
          done();
        },
      });
  });

  it('should NOT call db query if input validation fails', done => {
    const spiedDbQuery = jest.fn(mockDbQuery);
    const badInputResolver = create.one({
      ...commonConfig,
      validateInput: notOk,
      validateResult: ok,
    })({ db: spiedDbQuery });

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
    const badOutputResolver = createMockResolver(ok, notOk);

    badOutputResolver(assetId)
      .run()
      .listen({
        onRejected: data => {
          expect(data).toEqual(assetId);
          done();
        },
      });
  });
});
