const { Nothing } = require('folktale/maybe');
const db = require('../createDb')();

describe('Exchange transactions should return ', () => {
  it('Maybe(data) for `one` tx correctly', done => {
    db.transactions.exchange
      .one('4WtUXBF6i41ohva66KTaxJsJzooc8mo12hGV6cPbVDek')
      .run()
      .listen({
        onResolved: maybeX => {
          const x = maybeX.getOrElse();
          expect(x).toMatchSnapshot();
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

  describe('filters', () => {
    it('empty filters should give last 100 txs', done => {
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

    describe('limit filter', () => {
      it('should work with limit 1 (less than MIN_LIMIT)', done => {
        db.transactions.exchange
          .many({ limit: 1 })
          .run()
          .listen({
            onResolved: mxs => {
              const xs = mxs.map(x => x.getOrElse(-1));
              expect(xs.length).toBe(1);
              done();
            },
          });
      });

      it('should use default limit of 100 when when no limit specified', done => {
        db.transactions.exchange
          .many({ timeStart: new Date('2018-01-01') })
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
    xit('timeStart/timeEnd filter should work', () => {});
    xit('timeStart filter should work', () => {});
  });

  xdescribe('Pagination', () => {
    xit('sort should work', () => {});
    xit('after should work', () => {});
  });
});
