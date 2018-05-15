const { Nothing } = require('folktale/maybe');

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

describe('Pair request should', () => {
  it('return Maybe(data) for `one` pair correctly', done => {
    db.pairs
      .one('WAVES/8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS')
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

  it('return Maybe(data)[] for `many` pairs request', done => {
    db.pairs
      .many([
        'WAVES/8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
        'NON_EXISTING_PAIR',
        '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu/8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
      ])
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
});
