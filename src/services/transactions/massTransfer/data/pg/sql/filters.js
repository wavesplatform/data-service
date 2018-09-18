const { where, limit } = require('../../../../../../db/sql/utils/knex');
const { selectIdsWhereRecipient } = require('./query');

const recipient = rec => q =>
  q.clone().whereIn('txs_11.id', selectIdsWhereRecipient(rec));
const id = where('txs_11.id');
const assetId = where('asset_id');
const sender = where('sender');

const after = ({ timestamp, id, sortDirection }) => q => {
  const comparator = sortDirection === 'desc' ? '<' : '>';
  return q
    .clone()
    .whereRaw(`(time_stamp, id) ${comparator} (?, ?)`, [timestamp, id]);
};
const timeStart = where('time_stamp', '>=');
const timeEnd = where('time_stamp', '<=');
const sort = s => q =>
  q
    .clone()
    .orderBy('time_stamp', s)
    .orderBy('id', s);

module.exports = {
  id,
  sender,
  after,
  assetId,
  timeStart,
  timeEnd,
  sort,
  recipient,
  limit,
};
