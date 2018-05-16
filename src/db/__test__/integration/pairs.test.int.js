const { Nothing } = require('folktale/maybe');
const pair = require('../mocks/pair');

const loadConfig = require('../../../loadConfig');
const createDb = require('../../index');

const db = createDb(loadConfig());

const isPair = mx => {
  if (typeof mx !== 'object') return false;

  const isNumber = x => typeof x === 'number';
  return (
    isNumber(mx.first_price) && isNumber(mx.last_price) && isNumber(mx.volume)
  );
};

describe('Pair request should return ', () => {
  it('Maybe(data) for `one` pair correctly', done => {
    db.pairs
      .one(pair('WAVES', 'BTC'))
      .run()
      .listen({
        onResolved: maybeX => {
          const x = maybeX.getOrElse();
          expect(isPair(x)).toBe(true);
          done();
        },
      });

    db.pairs
      .one('NON_EXISTING_PAIR')
      .run()
      .listen({
        onResolved: maybeX => {
          expect(maybeX).toEqual(Nothing());
          done();
        },
      });
  });

  it('Maybe(data)[] for `many` pairs request', done => {
    db.pairs
      .many([pair('WAVES', 'BTC'), 'NON_EXISTING_PAIR', pair('ETH', 'BTC')])
      .run()
      .listen({
        onResolved: mxs => {
          const xs = mxs.map(x => x.getOrElse(-1));

          expect(isPair(xs[0])).toBe(true);
          expect(isPair(xs[2])).toBe(true);

          expect(xs[1]).toBe(-1);
          done();
        },
      });
  });
});
