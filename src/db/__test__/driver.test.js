const pgt = require('../driver');

const { driverConnectMock } = require('./mocks');

test('pgt works', done => {
  const taskedDbDriver = pgt({}, driverConnectMock);

  taskedDbDriver
    .many('some sql', [1, 2, 3])
    .run()
    .listen({
      onResolved: xs => {
        expect(xs).toEqual([1, 2, 3]);
        done();
      },
    });
});

module.exports = { driverConnectMock };
