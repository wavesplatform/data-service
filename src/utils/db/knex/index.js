const { omit } = require('ramda');

const K = require('./lib');

module.exports = omit('hasMethod', K);
