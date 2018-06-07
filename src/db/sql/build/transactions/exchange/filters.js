const { where, limit } = require('../../../utils/knex');

const { curryN } = require('ramda');

const bySender = curryN(2, (sender, q) =>
  q
    .clone()
    .innerJoin({ o: 'orders' }, function() {
      this.on('t.order1', '=', 'o.id').orOn('t.order2', '=', 'o.id');
    })
    .where('o.sender', sender)
);

const after = ({ timestamp, id, sortDirection }) => q => {
  const comparator = sortDirection === 'desc' ? '<' : '>';
  return q.whereRaw(`(t.time_stamp, t.id) ${comparator} (?, ?)`, [
    timestamp,
    id,
  ]);
};

module.exports = {
  id: where('t.id'),
  after,
  sortOuter: s => q => q.orderBy('tx_time_stamp', s).orderBy('tx_id', s),
  sort: s => q => q.orderBy('t.time_stamp', s).orderBy('t.id', s),
  matcher: where('t.sender'),
  amountAsset: where('t.amount_asset'),
  priceAsset: where('t.price_asset'),
  timeStart: where('t.time_stamp', '>='),
  timeEnd: where('t.time_stamp', '<='),
  limit,
  sender: bySender,
};
