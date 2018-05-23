const { Nothing } = require('folktale/maybe');

const loadConfig = require('../../../loadConfig');
const createDb = require('../../index');

const db = createDb(loadConfig());

describe('Exchange transactions should return ', () => {
  it('Maybe(data) for `one` tx correctly', done => {
    db.transactions.exchange
      .one('4WtUXBF6i41ohva66KTaxJsJzooc8mo12hGV6cPbVDek')
      .run()
      .listen({
        onResolved: maybeX => {
          const x = maybeX.getOrElse();

          expect(x.tx_id).toBe('4WtUXBF6i41ohva66KTaxJsJzooc8mo12hGV6cPbVDek');
          expect(x.tx_price.toString()).toBe('0.00065851');
          expect(x.tx_amount.toString()).toBe('1693.80213373');

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
