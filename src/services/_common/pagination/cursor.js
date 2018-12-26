const { curryN } = require('ramda');

const encode = curryN(2, (sort, item) =>
  Buffer.from(`${item.timestamp.toISOString()}::${item.id}::${sort}`).toString(
    'base64'
  )
);

const decode = cursor =>
  Buffer.from(cursor, 'base64')
    .toString('utf8')
    .split('::');

module.exports = {
  encode,
  decode,
};
