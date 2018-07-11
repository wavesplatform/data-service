const { compose } = require('ramda');

const create = require('./create');
const taskify = require('./taskify');

module.exports = compose(
  taskify,
  create
);
