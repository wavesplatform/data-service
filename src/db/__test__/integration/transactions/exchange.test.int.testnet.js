const { Nothing } = require('folktale/maybe');

const db = require('../createDb')();

describe('Exchange transactions should return ', () => {
  it('Maybe(data) for `one` tx correctly', done => {
    db.transactions.exchange
      .one('HEUzCw8JuzWNxxYHjw7i7cTKkJbw6hGAY5vKdHWecSJA')
      .run()
      .listen({
        onResolved: maybeX => {
          expect(maybeX).toMatchSnapshot();
          done();
        },
      });

    db.transactions.exchange
      .one('NON_EXISTING_TX')
      .run()
      .listen({
        onResolved: maybeX => {
          expect(maybeX).toEqual(Nothing());
          done();
        },
      });
  });

  it('Maybe(data)[] for `many` txs request', done => {
    db.transactions.exchange
      .many()
      .run()
      .listen({
        onResolved: mxs => {
          const xs = mxs.map(x => x.getOrElse(-1));
          expect(xs.length).toBe(100);
          done();
        },
      });
  });
});
