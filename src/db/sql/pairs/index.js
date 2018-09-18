const query = require('./query');
const { map, toString, compose } = require('ramda');

module.exports = map(
  f =>
    compose(
      toString,
      f
    ),
  query
);
