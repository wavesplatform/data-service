const commonFilters = require('../../../_common/sql/filters');

const byTimeStamp = (comparator) => (ts) => (q) =>
  q.clone().where('time_stamp', comparator, ts);

const after = ({ uid, sort }) => (q) => {
  const comparator = sort === 'desc' ? '<' : '>';
  return q.clone().whereRaw(`t.uid ${comparator} ${uid.toString()}`);
};

module.exports = {
  filters: {
    ...commonFilters,
    timeStart: byTimeStamp('>'),
    timeEnd: byTimeStamp('<'),
    sort: (s) => (q) => q.clone().orderBy('t.uid', s),
    after,
  },
};
