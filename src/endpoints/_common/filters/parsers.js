const { identity, defaultTo, compose } = require('ramda');

const { parseDate } = require('../../../utils/parseDate');
const { parseArrayQuery } = require('../../utils/parseArrayQuery');

const dateOrNull = str => parseDate(str).getOrElse(null);
const trimedQueryOrNull = q =>
  typeof q === 'undefined' ? null : q.toString().trim();

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
  query: trimedQueryOrNull,
};
