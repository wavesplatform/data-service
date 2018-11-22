const Result = require('folktale/result');
const { toValidationError } = require('../errorHandling/factories');

const { interval: intervalRegex } = require('../utils/regex');

/**
 * Calculates interval length in milliseconds
 * @param {String} s
 * @returns Number
 */
const getLengthMilliseconds = s => {
  const units = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
    M: 60 * 60 * 24 * 31,
    Y: 60 * 60 * 24 * 31 * 366,
  };
  const n = +s.substr(0, s.length - 1);
  const u = s.substr(-1);
  return n * units[u] * 1000;
};

const Interval = s => {
  // validate
  if (typeof s !== 'string') throw new Error('String argument expected');
  if (!intervalRegex.test(s))
    throw new Error('String argument does not match interval pattern');

  const length = getLengthMilliseconds(s);
  return {
    length,
    div: i => length / i.length,
    toString: () => s,
    toJSON: () => s,
  };
};

Interval.from = s => {
  try {
    return Result.Ok(Interval(s));
  } catch (err) {
    return Result.Error(toValidationError('Interval parsing', err));
  }
};

module.exports = Interval;
