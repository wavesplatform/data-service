const { where, limit, raw } = require('../../../../../../db/sql/utils/knex');

const id = where('id');
const type = t => q =>
  q.clone().where(raw(`cast(tx ->> 'type' as smallint) = ?`, [t]));
const sender = s => q => q.clone().whereRaw("tx ->> 'sender' = ?", [s]);
const recipient = r => q =>
  q
    .clone()
    .whereRaw(`tx -> 'transfers' @> '[{"recipient": ?}]'`, [r])
    .orWhere(raw(`tx ->> 'recipient' = ?`, [r]));

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
  type,
  timeStart,
  timeEnd,
  sort,
  limit,
};
