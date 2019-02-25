const { reject, isNil } = require('ramda');
const { parseDate } = require('../../utils/parseDate');
const { parseBool } = require('../utils/parseBool');
const { parseArrayQuery } = require('../utils/parseArrayQuery');

const { BigNumber } = require('@waves/data-entities');

const parseValue = (type, value) => {
  if (type === 'boolean') return parseBool(value);
  else if (type === 'integer') return new BigNumber(value);
  else return value;
};

const parseFilters = ({
  ids,
  timeStart, // No default value for timestart, other way - bad for desc pagination
  timeEnd,
  sender,
  limit = 100,
  sort = 'desc',
  key,
  type,
  value,
  after,
}) =>
  reject(isNil, {
    ids: ids && parseArrayQuery(ids),
    timeStart: timeStart && parseDate(timeStart).getOrElse(null),
    timeEnd: timeEnd && parseDate(timeEnd).getOrElse(null),
    limit: parseInt(limit),
    sort,
    sender,
    key,
    type,
    value: parseValue(type, value),
    after,
  });

module.exports = parseFilters;
