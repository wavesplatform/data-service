const loadConfig = require('../loadConfig');
const createDb = require('./index');

const db = createDb(loadConfig());

db
  .assets([
    'G8VbM7B6Zu8cYMwpfRsaoKvuLVsy8p1kYP4VvSdwxWfH',
    '5ZUsD93EbK1SZZa2GXYZx3SjhcXWDvMKqzWoJZjNGkW8',
  ])
  .run()
  .listen({
    onResolved: console.log, // eslint-disable-line
    onRejected: console.error, // eslint-disable-line
  });
