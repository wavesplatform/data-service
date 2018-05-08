const { curryN } = require('ramda');

module.exports = curryN(2, (fn, x) => {
  fn(x);
  return x;
});
