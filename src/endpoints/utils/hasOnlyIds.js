const { compose, keys, equals } = require('ramda');

const hasOnlyIds = compose(
  equals(['ids']),
  keys
);

module.exports = { hasOnlyIds };
