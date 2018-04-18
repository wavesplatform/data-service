const createDbAdapter = require('./');

const { dbSuccess, dbFail } = require('../mocks/db');

// spec
describe('Db adapter should return a Task than', () => {
  it('resolves with proper values', done => {
    const a = createDbAdapter(dbSuccess);
    a
      .assets(['q', 'w'])
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual([{ id: 'q' }, { id: 'w' }]);
          done();
        }
      });
  });

  it('rejects with proper error on failure', done => {
    const a = createDbAdapter(dbFail);

    a
      .assets(['q', 'w'])
      .run()
      .listen({
        onRejected: err => {
          expect(err.message).toEqual('Db error');
          done();
        }
      });
  });
});
