const R = require('ramda');
const pgp = require('pg-promise');

const addParens = s => `(${s})`;

const formatPairs = R.pipe(
  R.map(R.pipe(pgp.as.csv, addParens)),
  R.join(','),
  addParens
);

module.exports = {
  formatPairs,
};
