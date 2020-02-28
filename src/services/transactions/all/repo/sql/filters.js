const { where, whereIn } = require('../../../../../utils/db/knex');
const commonFilters = require('../../../_common/sql/filters');

const id = id => where('id', id);

const ids = ids => whereIn('id', ids);

const byTimeStamp = comparator => ts => where('time_stamp', comparator, ts);

const after = ({ tx_uid, sort }) => {
  const comparator = sort === 'desc' ? '<' : '>';
  return where('t.uid', comparator, tx_uid);
};

module.exports = {
  filters: {
    ...commonFilters,
    id,
    ids,
    timeStart: byTimeStamp('>='),
    timeEnd: byTimeStamp('<='),
    sort: s => q => q.clone().orderBy('t.uid', s),
    after,
  },
};
