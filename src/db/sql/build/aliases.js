const pg = require('knex')({ client: 'pg' });

const LIMIT = 1000;

const select = pg('txs_10')
  .select({
    address: 'sender',
    alias: 'alias',
  })
  .limit(LIMIT);

module.exports = {
  one: alias =>
    select
      .clone()
      .where('alias', alias)
      .toString(),
  many: ({ address }) =>
    select
      .clone()
      .where('sender', address)
      .orderBy('time_stamp', 'asc')
      .toString(),
};
