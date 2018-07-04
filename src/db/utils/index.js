const R = require('ramda');
const pgp = require('../driver/pgp');

const addParens = s => `(${s})`;

const formatPairs = R.pipe(
  R.map(R.pipe(pgp.as.csv, addParens)),
  R.join(','),
  addParens
);

module.exports = {
  formatPairs,
  batchQuery: require('./batchQuery'),
};
