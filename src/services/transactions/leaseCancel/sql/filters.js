const { where, limit } = require('../../../../utils/db/knex');

const id = where('id');
const sender = where('sender');

// txs_9 do not contain recipient info directly
// only txs_8 do
const recipient = r => q =>
  q.clone().whereIn('lease_id', function() {
    this.select('id')
      .from('txs_8')
      .where('recipient', r);
  });

const after = ({ timestamp, id, sortDirection }) => q => {
  const comparator = sortDirection === 'desc' ? '<' : '>';
  return q
    .clone()
    .whereRaw(`(t.time_stamp, t.id) ${comparator} (?, ?)`, [timestamp, id]);
};
const timeStart = where('t.time_stamp', '>=');
const timeEnd = where('t.time_stamp', '<=');
const sort = s => q =>
  q
    .clone()
    .orderBy('t.time_stamp', s)
    .orderBy('t.id', s);

module.exports = {
  id,
  sender,
  recipient,
  after,
  timeStart,
  timeEnd,
  sort,
  limit,
};
