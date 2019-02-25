const { parseDate } = require('../../../../utils/parseDate');
const Cursor = require('../../../_common/pagination/cursor');

const decodeAfter = cursor => {
  const [date, id, sort] = Cursor.decode(cursor);
  // Date here is always valid, checked by validation step previously
  const parsedDate = parseDate(date).getOrElse(null);
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
