const { curryN } = require('ramda');

/**
 * @param {Monoid} monoid
 * @param {Array} list
 */
module.exports = curryN(2, (monoid, list) => {
  return list.reduce(monoid.concat, monoid.empty);
});
