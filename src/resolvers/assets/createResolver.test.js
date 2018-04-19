const db = require('../../db/index.mock');
const createAssetsResolver = require('./createResolver');

const { Either } = require('monet');

const ids = [
  'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
  '5ZUsD93EbK1SZZa2GXYZx3SjhcXWDvMKqzWoJZjNGkW8',
];

const ok = x => Either.Right(x);
const notOk = x => Either.Left(x);

const createMockResolver = (validateInput, validateResult) =>
  createAssetsResolver({ validateInput, validateResult })({ ids, api: db });

describe('Resolver', () => {
  it('should return result if all validation pass', done => {
    const goodResolver = createMockResolver(ok, ok);

    goodResolver.run().listen({
      onResolved: data => {
        expect(data).toEqual([ids]);
        done();
      },
    });
  });

  it('should take left branch if input validation fails', done => {
    const badInputResolver = createMockResolver(notOk, ok);

    badInputResolver.run().listen({
      onRejected: data => {
        expect(data.ids).toEqual(ids);
        done();
      },
    });
  });

  it('should NOT call db query if input validation fails', done => {
    const spiedDb = { assets: jest.fn(db.assets) };
    const badInputResolver = createAssetsResolver({
      validateInput: notOk,
      validateResult: ok,
    })({ ids, api: spiedDb });

    badInputResolver.run().listen({
      onRejected: () => {
        expect(spiedDb.assets).not.toBeCalled();
        done();
      },
    });
  });

  it('should take left branch if output validation fails', done => {
    const badOutputResolver = createMockResolver(ok, notOk);

    badOutputResolver.run().listen({
      onRejected: data => {
        expect(data).toEqual([ids]);
        done();
      },
    });
  });
});
