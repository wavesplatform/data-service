const { of, rejected } = require('folktale/concurrency/task');
const createAdapter = require('../adapter');

const goodResponseDriver = {
  many: (_, a) => of(a),
};
const badResponseDriver = {
  many: (_, a) => rejected(a),
};

const createMockAdapter = driver =>
  createAdapter({
    taskedDbDriver: driver,
    batchQueryFn: () => x => x,
    errorFactory: () => x => x,
  });

const goodAdapter = createMockAdapter(goodResponseDriver);
const badAdapter = createMockAdapter(badResponseDriver);

test('Adapter returns resolving task ', done => {
  goodAdapter
    .assets([1, 2, 3])
    .run()
    .listen({
      onResolved: xs => {
        expect(xs).toEqual([[1, 2, 3]]);
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
