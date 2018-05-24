const { identity, pathEq, ifElse } = require('ramda');
var colorize = require('json-colorizer');

const isDev = pathEq(['env', 'NODE_ENV'], 'development');
const stringifyMetaInProd = ifElse(
  isDev,
  () => identity,
  () => JSON.stringify.bind(JSON)
)(process);
const separator = () => new Array(64).fill('-').join('');

const stringify = ifElse(
  isDev,
  () => json => `${colorize(JSON.stringify(json, null, 2))}\n${separator()}`,
  () => json => JSON.stringify(json)
)(process);

module.exports = {
  isDev,
  stringifyMetaInProd,
  stringify,
};
