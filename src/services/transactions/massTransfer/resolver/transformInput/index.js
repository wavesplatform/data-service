const { parseDate } = require('../../../../../utils/parseDate');
const Cursor = require('../../../../../resolvers/pagination/cursor');

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
const transformInput = filters => {
  if (!filters.after) {
    return filters;
  }
  return { ...filters, ...decodeAfter(filters.after) };
};

module.exports = transformInput;
