const JSONBig = require('@waves/json-bigint');
const { BigNumber } = require('@waves/data-entities');

const { map, compose } = require('ramda');

module.exports = compose(
  map(x => new BigNumber(x)),
  s => JSONBig.parse(s)
);
