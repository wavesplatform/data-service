const { where, whereIn, limit } = require('../../../../utils/db/knex/index');

const id = where('id');
const ids = whereIn('id');

const sender = where('sender');

const timeStart = where('time_stamp', '>=');
const timeEnd = where('time_stamp', '<=');

const sort = s => q => q.clone().orderBy('uid', s);

const after = ({ uid, sort }) => q => {
  const comparator = sort === 'desc' ? '<' : '>';
  return q.clone().where('uid', comparator, uid);
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
