const { curryN } = require('ramda');

/**
 * @param {Monoid} monoid
 * @param {Foldable} list
 */
module.exports = curryN(2, (monoid, list) => {
  return list.reduce(monoid.concat, monoid.empty);
});
