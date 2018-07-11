const { Nothing } = require('folktale/maybe');

const db = require('./createDb')();

const ADDRESS = '3PDSJEfqQQ8BNk7QtiwAFPq7SgyAh5kzfBy';

describe('Aliases', () => {
  it('should return Maybe(alias) for `one` correctly', done => {
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
    it('should return correct data if requested without `showBroken`', done => {
      db.aliases
        .many({ address: ADDRESS })
        .run()
        .listen({
          onResolved: mxs => {
            expect(mxs).toMatchSnapshot();
            done();
          },
        });
    });

    it('should return correct data if requested with `showBroken`', done => {
      db.aliases
        .many({
          address: ADDRESS,
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
