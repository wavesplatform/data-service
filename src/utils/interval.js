/**
 * Parses interval
 * @param {String} interval
 * @returns [Number, String]
 */
const parseInterval = interval => [
  +interval.substr(0, interval.length - 1),
  interval.substr(-1),
];

/**
 * Calculates interval value 
 * @param {[Number, String]} parsedInterval 
 * @returns Number
 */
const intervalValue = parsedInterval => {
  const units = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
    M: 60 * 60 * 24 * 31,
    Y: 60 * 60 * 24 * 31 * 366,
  };

  return parsedInterval[0] * units[parsedInterval[1]];
};

/**
 * Calculates quantity of periods in interval by divider
 * @param {String} interval 
 * @param {String} divider 
 * @returns Number
 */
const intervalSize = (interval, divider) => {
  divider = divider || '1m';
  const parsedDivider = parseInterval(divider);
  const parsedInterval = parseInterval(interval);

  return intervalValue(parsedInterval) / intervalValue(parsedDivider);
};

module.exports = {
  parseInterval,
  intervalValue,
  intervalSize,
};
