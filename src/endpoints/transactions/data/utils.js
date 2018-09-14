const { reject, isNil } = require('ramda');
const { parseDate } = require('../../../utils/parseDate');
const { parseBool } = require('../../utils/parseBool');

const { BigNumber } = require('@waves/data-entities');

// integer, boolean, string, binary

const parseValue = (type, value) => {
  if (type === 'boolean') return parseBool(value);
  else if (type === 'number') return new BigNumber(value);
  else return value;
};

const selectFilters = ({
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
    timeStart: timeStart && parseDate(timeStart),
    timeEnd: timeEnd && parseDate(timeEnd),
    limit: parseInt(limit),
    sort,
    sender,
    key,
    type,
    value: parseValue(type, value),
    after,
  });

module.exports = { selectFilters };
