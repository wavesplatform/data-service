const pgt = require('../driver');

const { driverP } = require('./mocks');

describe('Tasked driver method', () => {
  const driverT = pgt({}, driverP);

  test('none works', done => {
    driverT
      .none('some sql', [1, 2, 3])
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual(undefined);
          done();
        },
      });
  });

  test('any works', done => {
    driverT
      .any('some sql', [1, 2, 3])
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual([1, 2, 3]);
          done();
        },
      });
    driverT
      .any('some sql', [1, 2, 3])
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual(undefined);
          done();
        },
      });
  });

  test('one works', done => {
    driverT
      .one('some sql', 'single_value')
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual('single_value');
          done();
        },
      });
  });

  test('oneOrNone works', done => {
    driverT
      .oneOrNone('some sql', 'single_value')
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual('single_value');
          done();
        },
      });

    driverT
      .oneOrNone('some sql')
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual(undefined);
          done();
        },
      });
  });

  test('many works', done => {
    driverT
      .many('some sql', [1, 2, 3])
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual([1, 2, 3]);
          done();
        },
      });
  });

  test('task works with batch query', done => {
    driverT
      .task(t => t.batch([1, 2, 3]))
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual([1, 2, 3]);
          done();
        },
      });
  });
});
