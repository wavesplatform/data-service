const { createPgDriver } = require('../driver');

const { driver } = require('./mocks');

describe('Tasked driver method', () => {
  const driverT = createPgDriver({}, () =>
    driver.create(x => Promise.resolve(x), (...args) => args)
  );

  test('none works', done => {
    driverT
      .none('some sql')
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual(['some sql', undefined]);
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
          expect(xs).toEqual(['some sql', [1, 2, 3]]);
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
          expect(xs).toEqual(['some sql', 'single_value']);
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
          expect(xs).toEqual(['some sql', 'single_value']);
          done();
        },
      });

    driverT
      .oneOrNone('some sql')
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual(['some sql', undefined]);
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
          expect(xs).toEqual(['some sql', [1, 2, 3]]);
          done();
        },
      });
  });

  test('task works with batch query', done => {
    driverT
      .task('CALLBACK_ARG')
      .run()
      .listen({
        onResolved: xs => {
          expect(xs).toEqual(['CALLBACK_ARG']);
          done();
        },
      });
  });
});
