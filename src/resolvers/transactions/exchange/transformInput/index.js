const { omit } = require('ramda');
const { parseDate } = require('../../../../utils/parseDate');
const { decode } = require('../pagination/cursor');

const decodeAfter = cursor => {
  const [maybeDate, maybeId, sort] = decode(cursor);
  const parsedDate = parseDate(maybeDate);
  return {
    after: {
      timestamp: parsedDate,
      id: maybeId,
      sortDirection: sort,
    },
    ...(sort ? { sort } : {}),
  };
};
const transformInput = filters =>
  filters.after
    ? { ...omit(['after'], filters), ...decodeAfter(filters.after) }
    : filters;

module.exports = transformInput;
