const { Nothing } = require('folktale/maybe');

const loadConfig = require('../../../loadConfig');
const createDb = require('../../index');

const db = createDb(loadConfig());

describe('Assets should return', () => {
  it('return Maybe(data) for `one` correctly', done => {
    db.assets
      .one('G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH')
      .run()
      .listen({
        onResolved: maybeX => {
          const x = maybeX.getOrElse();
          expect(x.asset_id).toEqual(
            'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH'
          );
          expect(x.decimals).toEqual(8);
          done();
        },
      });

    db.assets
      .one('NON_EXISTING_PAIR')
      .run()
      .listen({
        onResolved: maybeX => {
          expect(maybeX).toEqual(Nothing());
          done();
        },
      });
  });

  it('return Maybe(data)[] for `many` request', done => {
    db.assets
      .many([
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
          expect(mxs[1]).toEqual(Nothing());
          done();
        },
      });
  });
});
