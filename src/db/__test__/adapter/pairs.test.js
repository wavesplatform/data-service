const Maybe = require('folktale/maybe');
const { adapter } = require('../mocks');

describe('Pairs methods should correctly', () => {
  const takeSecond = (a, b) => b;
  const taskTransform = fn => fn({ oneOrNone: takeSecond, batch: x => x });
  const A = {
    one: {
      good: adapter.good(takeSecond),
      bad: adapter.bad(takeSecond),
    },
    many: {
      good: adapter.good(taskTransform),
      bad: adapter.bad(taskTransform),
    },
  };

  it('resolve one', done => {
    A.one.good.pairs
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
    A.one.bad.pairs
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
    A.many.good.pairs
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
    A.many.bad.pairs
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
