const { identity, defaultTo, compose } = require('ramda');

const { parseDate } = require('../../../utils/parseDate');
const { parseArrayQuery } = require('../../utils/parseArrayQuery');

const dateOrNull = str => parseDate(str).getOrElse(null);
const trimedStringOrNull = q =>
  typeof q === 'undefined' ? undefined : q.toString().trim();

const intOrNull = x => {
  const y = parseInt(x);
  return isNaN(y) ? null : y;
};

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
  intOrNull,
  query: trimedStringOrNull,
};
