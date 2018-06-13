/**
 *
 * @param {String} str unix timestamp or other date-like string
 * @returns {Date}
 */
const moment = require('moment');
const parseDate = str => {
  const date = new Date(/^-?\d+$/.test(str) ? parseInt(str) : str);
  // @hack
  // Moment doesn't work great with implicit format
  // But it handles invalid values great
  return moment(date).toISOString();
};

module.exports = { parseDate };
