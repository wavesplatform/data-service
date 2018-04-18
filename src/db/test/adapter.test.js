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
          expect(err.error.message).toEqual(
            'ECONNREFUSED: Unable to connect to db'
          );
          expect(err.meta.request).toEqual('assets');
          done();
        },
      });
  });

  it('correctly match partial and wrongly ordered results with requests', done => {
    const dbPartialSuccess = {
      many: (_, arr) =>
        Promise.resolve(transformFn(arr[0].filter(x => x !== 'e').reverse())),
    };

    const assets = ['q', 'w', 'e'];

    createDbAdapter(dbPartialSuccess)
      .assets(assets)
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual(transformFn(['q', 'w']).concat([null]));
          done();
        },
      });
  });
});
