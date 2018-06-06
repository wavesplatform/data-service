const { last, head } = require('ramda');

const cursorHashFn = request => items => {
  const item = (request.sort === 'desc' ? last(items) : head(items)).data;
  return `${item.timestamp.toISOString()}::${item.id}::${request.sort}`;
};

const decode = cursor => cursor.split('::');

module.exports = {
  cursorHashFn,
  decode,
};
