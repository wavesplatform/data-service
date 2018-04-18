const createDbAdapter = require('../adapter');

const { dbSuccess, dbFail, transformFn } = require('./mocks/db');

// spec
describe('Db adapter should return a Task than', () => {
  it('resolves with proper values', done => {
    const assets = ['q', 'w'];
    createDbAdapter(dbSuccess)
      .assets(assets)
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual(transformFn(assets));
          done();
        },
      });
  });

  it('rejects with proper error on failure', done => {
    createDbAdapter(dbFail)
      .assets()
      .run()
      .listen({
        onRejected: err => {
          expect(err.message).toEqual('Db error');
          done();
        },
      });
  });
});
