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

module.exports = {
  id: where('t.id'),
  matcher: where('t.sender'),
  timeStart: where('t.time_stamp', '>='),
  timeEnd: where('t.time_stamp', '<='),
  limit,
  sender: bySender,
};
