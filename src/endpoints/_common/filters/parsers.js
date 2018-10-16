const {
  isNil,
  identity,
  always,
  ifElse,
  defaultTo,
  compose,
} = require('ramda');

const { parseDate } = require('../../../utils/parseDate');
const { parseArrayQuery } = require('../../utils/parseArrayQuery');

const dateOrNull = ifElse(isNil, always(null), parseDate);

module.exports = {
  timeStart: dateOrNull,
  timeEnd: dateOrNull,
  limit: compose(
    parseInt,
    defaultTo(100)
  ),
  sort: defaultTo('desc'),
  after: identity,
  ids: parseArrayQuery,
};
