const { adapter, sql } = require('../mocks');

const { identity, last, prop, compose, path } = require('ramda');

describe('Exchange transactions methods should correctly', () => {
  const getSqlSpyArgs = compose(
    prop('apply'),
    last,
    last,
    path(['mock', 'calls'])
  );

  it('resolve one', done => {
    const spy = jest.fn();
    const oneGood = adapter.good(identity, sql.create(spy));

    // check sql query
    oneGood.transactions.exchange
      .one(1)
      .run()
      .listen({
        onResolved: () => {
          expect(getSqlSpyArgs(spy)).toEqual([1]);
          done();
        },
      });
  });

  it('reject one', done => {
    const spy = jest.fn();
    const oneBad = adapter.bad(identity, sql.create(spy));

    oneBad.transactions.exchange
      .one(1)
      .run()
      .listen({
        onRejected: () => {
          expect(getSqlSpyArgs(spy)).toEqual([1]);
          done();
        },
      });
  });

  // actual call occurs with the limit of no less than 5
  // as a workaround of postgres limit 1 issue
  const filters = { limit: 1, timeStart: new Date('2018-01-01') };
  const filtersWithLimit1Fix = { ...filters, limit: 5 };

  it('resolve many', done => {
    const spy = jest.fn();
    const manyGood = adapter.good(() => [], sql.create(spy));

    manyGood.transactions.exchange
      .many(filters)
      .run()
      .listen({
        onResolved: () => {
          expect(getSqlSpyArgs(spy)).toEqual([filtersWithLimit1Fix]);
          done();
        },
      });

    // limit >= 5 do not get substituted
    manyGood.transactions.exchange
      .many({ limit: 8 })
      .run()
      .listen({
        onResolved: () => {
          expect(getSqlSpyArgs(spy)).toEqual([{ limit: 8 }]);
          done();
        },
      });
  });

  it('reject many', done => {
    const spy = jest.fn();
    const manyBad = adapter.bad(() => [], sql.create(spy));

    manyBad.transactions.exchange
      .many(filters)
      .run()
      .listen({
        onRejected: () => {
          expect(getSqlSpyArgs(spy)).toEqual([filtersWithLimit1Fix]);
          done();
        },
      });

    // limit >= 5 do not get substituted
    manyBad.transactions.exchange
      .many({ limit: 8 })
      .run()
      .listen({
        onRejected: () => {
          expect(getSqlSpyArgs(spy)).toEqual([{ limit: 8 }]);
          done();
        },
      });
  });
});
