/**
 * @typedef {object} AliasDbResponse
 * @property {string} alias
 * @property {string} address
 * @property {number} duplicates
 */

/**
 * @typedef {object} AliasInfoRaw
 * @property {string} alias
 * @property {string | null} address
 */

/**
 * DB task returns array of values:
 * @typedef {function} transformResults
 * @param {AliasDbResponse} result
 * @returns AliasInfoRaw
 */
const transformResults = result => ({
  alias: result.alias,
  address: result.duplicates > 1 ? null : result.address,
});

module.exports = transformResults;
