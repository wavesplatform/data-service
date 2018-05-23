const Maybe = require('folktale/maybe');
const { adapter } = require('../mocks');

describe('Asset methods should correctly', () => {
  const headSecondArg = (a, b) => b[0];

  const goodAdapter = adapter.good(headSecondArg);
  const badAdapter = adapter.bad(headSecondArg);

  it('resolve many', done => {
    goodAdapter.assets
      .many([1, 2, 3])
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual([1, 2, 3].map(Maybe.of));
          done();
        },
      });
  });

  it('reject many', done => {
    badAdapter.assets
      .many([1, 2, 3])
      .run()
      .listen({
        onRejected: xs => {
          expect(xs).toEqual([1, 2, 3]);
          done();
        },
      });
  });

  it('resolve one', done => {
    goodAdapter.assets
      .one(1)
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual(Maybe.Just(1));
          done();
        },
      });
  });

  it('reject one', done => {
    badAdapter.assets
      .many(1)
      .run()
      .listen({
        onRejected: xs => {
          expect(xs).toEqual(1);
          done();
        },
      });
  });
});
