const Maybe = require('folktale/maybe');
const { goodAdapter, badAdapter } = require('./mocks/');

// ASSETS
describe('Asset method should correctly', () => {
  it('resolve many', done => {
    goodAdapter.assets
      .many([1, 2, 3])
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual([Maybe.Just([1, 2, 3])]); // because of sql query accepting [[1, 2, 3]]
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
          expect(xs).toEqual([[1, 2, 3]]); // because of sql query accepting [[1, 2, 3]]
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
          expect(xs).toEqual(Maybe.Just([1])); // because of sql query accepting [[1, 2, 3]]
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
          expect(xs).toEqual([1]);
          done();
        },
      });
  });
});

// PAIRS
describe('Pairs method should correctly', () => {
  it('resolve one', done => {
    goodAdapter.pairs
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
    badAdapter.pairs
      .one(1)
      .run()
      .listen({
        onRejected: xs => {
          expect(xs).toEqual(1);
          done();
        },
      });
  });

  it('resolve many', done => {
    goodAdapter.pairs
      .many([1, 2, 3])
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual([1, 2, 3].map(Maybe.Just));
          done();
        },
      });
  });

  it('reject many', done => {
    badAdapter.pairs
      .many([1, 2, 3])
      .run()
      .listen({
        onRejected: xs => {
          expect(xs).toEqual([1, 2, 3]);
          done();
        },
      });
  });
});
