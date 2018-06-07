const { last, head } = require('ramda');

const cursorHashFn = request => items => {
  const item = (request.sort === 'desc' ? last(items) : head(items)).data;
  return Buffer.from(
    `${item.timestamp.toISOString()}::${item.id}::${request.sort}`
  ).toString('base64');
};

const decode = cursor =>
  Buffer.from(cursor, 'base64')
    .toString('ascii')
    .split('::');

module.exports = {
  cursorHashFn,
  decode,
};
