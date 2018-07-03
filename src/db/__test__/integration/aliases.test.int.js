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

  describe('request by address', () => {
    it('returns correct data if requested without `showBroken`', done => {
      db.aliases
        .many({ address: '3PDSJEfqQQ8BNk7QtiwAFPq7SgyAh5kzfBy' })
        .run()
        .listen({
          onResolved: mxs => {
            expect(mxs).toMatchSnapshot();
            done();
          },
        });
    });

    it('returns correct data if requested without `showBroken`', done => {
      db.aliases
        .many({
          address: '3PDSJEfqQQ8BNk7QtiwAFPq7SgyAh5kzfBy',
          showBroken: true,
        })
        .run()
        .listen({
          onResolved: mxs => {
            expect(mxs).toMatchSnapshot();
            done();
          },
        });
    });
  });
});
