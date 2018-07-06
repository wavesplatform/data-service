const { BigNumber } = require('@waves/data-entities');

const { Nothing } = require('folktale/maybe');
const pair = require('../mocks/pair');

const loadConfig = require('../../../loadConfig');
const createDb = require('../../index');

const db = createDb(loadConfig());

const isPair = mx => {
  if (typeof mx !== 'object') return false;

  const isBigNumber = x => x instanceof BigNumber;
  return (
    isBigNumber(mx.first_price) &&
    isBigNumber(mx.last_price) &&
    isBigNumber(mx.volume) &&
    isBigNumber(mx.volume_waves)
  );
};

describe('Pair request ', () => {
  describe('one pair', () => {
    it('covers case: WAVES — amount asset', done => {
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
    });

    it('covers case: WAVES — price asset', done => {
      db.pairs
        .one(pair('ETH', 'WAVES'))
        .run()
        .listen({
          onResolved: maybeX => {
            const x = maybeX.getOrElse();
            expect(isPair(x)).toBe(true);
            done();
          },
        });
    });

    it('covers case: WAVES — neither price nor amount', done => {
      db.pairs
        .one(pair('ETH', 'BTC'))
        .run()
        .listen({
          onResolved: maybeX => {
            const x = maybeX.getOrElse();
            expect(isPair(x)).toBe(true);
            done();
          },
        });
    });

    it('covers non-existing assets', done => {
      db.pairs
        .one({ amountAsset: 'qwe', priceAsset: 'asd' })
        .run()
        .listen({
          onResolved: maybeX => {
            expect(maybeX).toEqual(Nothing());
            done();
          },
        });
    });
  });

  describe('many pairs', () => {
    const pairs = [
      pair('WAVES', 'BTC'),
      pair('ETH', 'WAVES'),
      pair('ETH', 'BTC'),
      { amountAsset: 'qwe', priceAsset: 'asd' },
    ];

    it('returns array of results on all possible WAVES positions', done => {
      db.pairs
        .many(pairs)
        .run()
        .listen({
          onResolved: msP => {
            const ps = msP.map(mp => mp.getOrElse(-1));

            expect(isPair(ps[0])).toBe(true);
            expect(isPair(ps[1])).toBe(true);
            expect(isPair(ps[2])).toBe(true);
            expect(ps[3]).toBe(-1);
            done();
          },
        });
    });
  });
});
