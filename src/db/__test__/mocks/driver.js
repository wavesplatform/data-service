const { reduce, curry } = require('ramda');

const createDriver = curry((resolve, fn) => {
  const m = (...args) => resolve(fn(...args));

  const ms = [
    'none',
    'any',
    'one',
    'many',
    'oneOrNone',
    'oneOrMany',
    'task',
    'tx',
  ];

  return reduce((acc, x) => ((acc[x] = m), acc), {}, ms);
});

module.exports = createDriver;
