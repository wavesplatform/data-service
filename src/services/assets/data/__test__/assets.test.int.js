const { BigNumber } = require('@waves/data-entities');

const { Nothing } = require('folktale/maybe');

// runtime dependencies
const loadConfig = require('../../../../loadConfig');
const { createPgDriver } = require('../../../../db');
const pg = createPgDriver(loadConfig());

const data = require('..')({ pg });

describe('Assets should return', () => {
  it('Maybe(data) for `one` correctly', done => {
    data
      .get('G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH')
      .run()
      .listen({
        onResolved: maybeX => {
          const x = maybeX.getOrElse();

          expect(x.asset_id).toEqual(
            'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH'
          );
          expect(x.decimals).toEqual(8);
          expect(x.total_quantity).toEqual(new BigNumber('100000000'));

          done();
        },
      });

    data
      .get('NON_EXISTING_PAIR')
      .run()
      .listen({
        onResolved: maybeX => {
          expect(maybeX).toEqual(Nothing());
          done();
        },
      });
  });

  it('Maybe(data)[] for `many` request', done => {
    data
      .mget([
        'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
        'NON_EXISTING_ASSET',
      ])
      .run()
      .listen({
        onResolved: mxs => {
          const x = mxs[0].getOrElse();
          expect(x.asset_id).toEqual(
            'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH'
          );
          expect(x.decimals).toEqual(8);
          expect(x.total_quantity).toEqual(new BigNumber('100000000'));

          expect(mxs[1]).toEqual(Nothing());
          done();
        },
      });
  });
});
