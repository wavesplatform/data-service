const { pathEq } = require('ramda');

const encode = object => object.tx_time_stamp + '::' + object.tx_id;

const decode = (cursor, sort) => {
  const filter = pathEq([0, 'timestamp'], 'desc', sort)
    ? 'timeEnd'
    : 'timeStart';
  return { [filter]: cursor.split('::')[0] };
};

module.exports = { encode, decode };
