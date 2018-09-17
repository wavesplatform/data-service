const { curry } = require('ramda');

const { where, limit, orderBy } = require('../../../../utils/db/knex');

const after = ({ timestamp, id, sortDirection }) => q => {
  const comparator = sortDirection === 'desc' ? '<' : '>';
  return q
    .clone()
    .whereRaw(`(time_stamp, id) ${comparator} (?, ?)`, [timestamp, id]);
};

const sort = curry((s, q) =>
  q
    .clone()
    .orderBy('time_stamp', s)
    .orderBy('id', s)
);

module.exports = {
  id: where('id'),
  after,
  sort,
  sortByDataPosition: orderBy('position_in_tx', 'asc'),
  sender: where('sender'),
  key: where('data_key'),
  type: where('data_type'),
  value: type => where(`data_value_${type}`),
  timeStart: where('time_stamp', '>='),
  timeEnd: where('time_stamp', '<'),
  limit,
};
