const pgt = require('./');

const driverConnectMock = () => ({
  many: a => Promise.resolve(a),
  none: () => Promise.resolve(),
});

test('pgt works', done => {
  const taskedDbDriver = pgt({}, driverConnectMock);

  taskedDbDriver
    .many([1, 2, 3])
    .run()
    .listen({
      onResolved: xs => {
        expect(xs).toEqual([1, 2, 3]);
        done();
      },
    });
});
