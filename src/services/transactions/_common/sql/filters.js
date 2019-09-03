const { whereIn, limit } = require('../../../../utils/db/knex/index');

const id = id =>
  whereIn('t.tuid', function() {
    this.select('uid')
      .from('txs')
      .where('id', id);
  });
const ids = ids =>
  whereIn('t.tuid', function() {
    this.select('uid')
      .from('txs')
      .whereIn('id', ids);
  });

const sender = addr =>
  whereIn('t.sender_uid', function() {
    this.select('uid')
      .from('addresses_map')
      .where('address', addr);
  });

const byTimeStamp = comparator => ts =>
  whereIn('t.tuid', comparator, function() {
    this.select('uid')
      .from('txs')
      .where('time_stamp', comparator, ts)
      .orderBy('time_stamp', comparator === '>=' ? 'asc' : 'desc')
      .limit(1);
  });

const sort = s => q => q.clone().orderBy('t.tuid', s);

const after = ({ id, sort }) => q => {
  const comparator = sort === 'desc' ? '<' : '>';
  return q.clone().whereIn('t.tuid', function() {
    this.select('uid')
      .from('txs')
      .where('uid', comparator, function() {
        this.select('uid')
          .from('txs')
          .where('id', id);
      });
  });
};

module.exports = {
  id,
  ids,
  sender,
  timeStart: byTimeStamp('>='),
  timeEnd: byTimeStamp('<='),
  sort,
  after,
  limit,
};
