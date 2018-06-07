/**
 *
 * @param {String} str unix timestamp or other date-like string
 * @returns {Date}
 */
const parseDate = str => new Date(/^-?\d+$/.test(str) ? parseInt(str) : str);
module.exports = { parseDate };
