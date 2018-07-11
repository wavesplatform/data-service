const JSONBig = require('@waves/json-bigint');
const { BigNumber } = require('@waves/data-entities');

const { map, compose } = require('ramda');

const parse = compose(
  map(x => new BigNumber(x)),
  s => JSONBig.parse(s)
);

const stringify = x => JSONBig.stringify(x);

module.exports = { parse, stringify };
