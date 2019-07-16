const { where, whereIn, limit } = require('../../../../utils/db/knex/index');

const id = where('id');
const ids = whereIn('id');

const sender = where('sender');

const timeStart = where('time_stamp', '>=');
const timeEnd = where('time_stamp', '<=');

const sort = s => q => q.clone().orderBy('generated_id', s);

const after = ({ generated_id, sort }) => q => {
  const comparator = sort === 'desc' ? '<' : '>';
  return q.clone().where('generated_id', comparator, generated_id);
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
