const { omit } = require('ramda');
const { parseDate } = require('../../../../utils/parseDate');
const Cursor = require('../../../../resolvers/pagination/cursor');

const decodeAfter = cursor => {
  const [date, id, sort] = Cursor.decode(cursor);
  const parsedDate = parseDate(date);
  return {
    after: {
      timestamp: parsedDate,
      id: id,
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
