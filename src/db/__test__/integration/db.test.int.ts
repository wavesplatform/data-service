import createDb from './createDb';

describe('Db', () => {
  const db = createDb();

  it('should successefully execute simple SQL-query', done => {
    db.one('select 1')
      .run()
      .listen({
        onResolved: () => done(),
        onRejected: e => done.fail(e.error.message),
      });
  });
});
