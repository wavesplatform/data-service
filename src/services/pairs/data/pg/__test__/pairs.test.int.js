const { BigNumber } = require('@waves/data-entities');

const { Nothing } = require('folktale/maybe');
const pair = require('../../__test__/mocks/pair');

// runtime dependencies
const loadConfig = require('../../../../../loadConfig');
const { createPgDriver } = require('../../../../../db');
const pg = createPgDriver(loadConfig());

const pgAdapter = require('../index')({ pg });

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

describe('Pair Postgres request ', () => {
  describe('one pair', () => {
    it('covers case: WAVES — amount asset', done => {
      pgAdapter
        .get(pair('WAVES', 'BTC'))
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
      pgAdapter
        .get(pair('ETH', 'WAVES'))
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
      pgAdapter
        .get(pair('ETH', 'BTC'))
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
      pgAdapter
        .get({ amountAsset: 'qwe', priceAsset: 'asd' })
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
      pgAdapter
        .mget(pairs)
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
