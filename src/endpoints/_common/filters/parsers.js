const { identity, defaultTo, compose } = require('ramda');

const { dateOrNull } = require('../../../utils/parseDate');
const { parseArrayQuery } = require('../../utils/parseArrayQuery');
const { trimmedStringIfDefined } = require('../../utils/parseString');

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
  query: trimmedStringIfDefined,
};
