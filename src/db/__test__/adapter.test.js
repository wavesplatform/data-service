const { pathOr } = require('ramda');

const Maybe = require('folktale/maybe');
const { goodAdapter, badAdapter } = require('./mocks/');

const createGoodTestForMethod = methodPath => {
  const selectMethod = pathOr(() => {
    throw new Error(`No method found on path ${methodPath.join('.')}`);
  }, methodPath);

  it(methodPath.join('.') + ' resolves correctly', done => {
    selectMethod(goodAdapter)([1, 2, 3])
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual([Maybe.Just([1, 2, 3])]);
          done();
        },
      });
  });

  it(methodPath.join('.') + ' rejects correctly', done => {
    selectMethod(badAdapter)([1, 2, 3])
      .run()
      .listen({
        onRejected: xs => {
          expect(xs).toEqual([[1, 2, 3]]);
          done();
        },
      });
  });
};

// todo rewrite to unit
describe('Adapter should', () => {
  // createGoodTestForMethod(['assets', 'one']);
  createGoodTestForMethod(['assets', 'many']);
  createGoodTestForMethod(['pairs', 'many']);
});

// test('Adapter returns resolving task ', done => {
//   goodAdapter
//     .assets([1, 2, 3])
//     .run()
//     .listen({
//       onResolved: xs => {
//         expect(xs).toEqual([Just([1, 2, 3])]);
//         done();
//       },
//     });
// });
// test('Adapter returns rejecting task', done => {
//   badAdapter
//     .assets([1, 2, 3])
//     .run()
//     .listen({
//       onRejected: xs => {
//         expect(xs).toEqual([[1, 2, 3]]);
//         done();
//       },
//     });
// });
