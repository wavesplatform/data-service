const { compose, reject, isNil, mapObjIndexed, tap } = require('ramda');

const parseFilterValues = parsers => values =>
  compose(
    reject(isNil),
    mapObjIndexed((val, key) => val(values[key]))
  )(parsers);

module.exports = {
  parseFilterValues,
  ...require('./parsers'),
};
