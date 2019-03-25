const { where, whereIn, limit } = require('../../../../utils/db/knex/index');

const id = where('id');
const ids = whereIn('id');

const sender = where('sender');

const timeStart = where('time_stamp', '>=');
const timeEnd = where('time_stamp', '<=');

const sort = s => q =>
  q
    .clone()
    .orderBy('time_stamp', s)
    .orderBy('id', s);

const after = ({ timestamp, id, sort }) => q => {
  const comparator = sort === 'desc' ? '<' : '>';
  return q
    .clone()
    .whereRaw(`(time_stamp, id) ${comparator} (?, ?)`, [timestamp, id]);
};

module.exports = {
  id,
  ids,
  sender,
  timeStart,
  timeEnd,
  sort,
  after,
  limit,
};
