const { map, adjust, compose, flatten } = require('ramda');
const getKey = require('./key');
const { stringify } = require('./serialization');

module.exports = compose(
  flatten,
  map(adjust(stringify, 1)), // stringify object
  map(adjust(getKey, 0)) // transform pair to key
);
