const { goodAdapter, badAdapter } = require('./mocks/');

const { Just } = require('folktale/maybe');

test('Adapter returns resolving task ', done => {
  goodAdapter
    .assets([1, 2, 3])
    .run()
    .listen({
      onResolved: xs => {
        expect(xs).toEqual([Just([1, 2, 3])]);
        done();
      },
    });
});
test('Adapter returns rejecting task', done => {
  badAdapter
    .assets([1, 2, 3])
    .run()
    .listen({
      onRejected: xs => {
        expect(xs).toEqual([[1, 2, 3]]);
        done();
      },
    });
});
