const { where, whereIn, limit } = require('../../../../utils/db/knex/index');

const id = id =>
  where('t.tx_uid', function() {
    this.select('uid')
      .from('txs')
      .where('id', id)
      .limit(1);
  });

const ids = ids =>
  whereIn('t.tx_uid', function() {
    this.select('uid')
      .from('txs')
      .whereIn('id', ids);
  });

const sender = addr =>
  where('t.sender_uid', function() {
    this.select('uid')
      .from('addresses')
      .where('address', addr);
  });

const byTimeStamp = comparator => ts =>
  where('t.tx_uid', comparator, function() {
    this.select('uid')
      .from('txs')
      .where('time_stamp', comparator, ts)
      .orderBy('time_stamp', comparator === '>=' ? 'asc' : 'desc')
      .limit(1);
  });

const sort = s => q => q.clone().orderBy('t.tx_uid', s);
const outerSort = s => q => q.clone().orderBy('txs.uid', s);

const after = ({ id, sort }) => q => {
  const comparator = sort === 'desc' ? '<' : '>';
  return q.clone().whereIn('t.tx_uid', function() {
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
  outerSort,
};
