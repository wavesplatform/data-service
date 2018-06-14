const { Nothing } = require('folktale/maybe');

const loadConfig = require('../../../loadConfig');
const createDb = require('../../index');

const db = createDb(loadConfig());

describe('Aliases should return', () => {
  it('Maybe(alias) for `one` correctly', done => {
    db.aliases
      .one('sexy-boys')
      .run()
      .listen({
        onResolved: maybeX => {
          expect(maybeX).toMatchSnapshot();
          done();
        },
      });

    db.aliases
      .one('NON_EXISTING_ALIAS')
      .run()
      .listen({
        onResolved: maybeX => {
          expect(maybeX).toEqual(Nothing());
          done();
        },
      });
  });

  it('Maybe(data)[] for `many` aliases request', done => {
    db.aliases
      .many({ address: '3PHXcxfQGAf3SgGGyg1Vendj5ZvjZxvC6KM' })
      .run()
      .listen({
        onResolved: mxs => {
          const xs = mxs.map(x => x.getOrElse(-1));
          expect(xs).toMatchSnapshot();
          done();
        },
      });
  });
});
