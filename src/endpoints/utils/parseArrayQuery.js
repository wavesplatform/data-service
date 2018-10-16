const { isNil } = require('ramda');

const parseArrayQuery = strOrArr => {
  if (isNil(strOrArr)) return;
  else if (typeof strOrArr === 'string') {
    if (!strOrArr.length) return [];
    else return strOrArr.split(',');
  } else return strOrArr;
};

module.exports = { parseArrayQuery };
