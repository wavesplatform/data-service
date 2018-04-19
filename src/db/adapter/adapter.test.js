const { of, rejected } = require('folktale/concurrency/task');
const createAdapter = require('./');

const goodResponseDriver = {
  many: (_, a) => of(a),
};
const badResponseDriver = {
  many: a => rejected(a),
};

const goodAdapter = createAdapter(goodResponseDriver);
const badAdapter = createAdapter(badResponseDriver);
test('Adapter resolves with task', done => {
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
test('Adapter rejects with task', done => {
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
