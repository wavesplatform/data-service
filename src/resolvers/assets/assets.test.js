const db = require('../../db/index.mock');
const assetsResolver = require('./');

test('Resolver works with correct ids', done => {
  const ids = [
    'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
    '5ZUsD93EbK1SZZa2GXYZx3SjhcXWDvMKqzWoJZjNGkW8',
  ];
  const result = assetsResolver({
    ids,
    api: db,
  });
  result.run().listen({
    onResolved: data => {
      expect(data).toEqual([ids]);
      done();
    },
    onRejected: err => {
      throw err;
    },
  });
});
test('Resolver fails with incorrect ids', done => {
  const ids = [1, '5ZUsD93EbK1SZZa2GXYZx3SjhcXWDvMKqzWoJZjNGkW8'];
  const result = assetsResolver({
    ids,
    api: db,
  });
  result.run().listen({
    onResolved: () => {
      throw 1;
    },
    onRejected: err => {
      expect(err).toBeDefined();
      done();
    },
  });
});
