const { and, findIndex, gte, sort } = require('ramda');
const Result = require('folktale/result');
const { toValidationError } = require('../errorHandling/factories');
const { interval: intervalRegex } = require('../utils/regex');

const units = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
  M: 60 * 60 * 24 * 31,
  Y: 60 * 60 * 24 * 31 * 366,
};

const sortedUnits = sort((a, b) => a + b, Object.values(units));

/**
 * Calculates interval length in milliseconds
 * @param {String} s
 * @returns Number
 */
const getLengthMilliseconds = s => {
  const n = +s.substr(0, s.length - 1);
  const u = s.substr(-1);
  return n * units[u] * 1000;
};

// @todo maybe take numbers, not strings? parse to string value if possible
const Interval = s => {
  // validate
  if (typeof s !== 'string') throw new Error('String argument expected');
  if (!intervalRegex.test(s))
    throw new Error(`String argument ${s} does not match interval pattern`);

  const length = getLengthMilliseconds(s);
  const unit = s.substr(-1);
  return {
    length,
    unit,
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

/** fromNumber :: number  */
Interval.fromNumber = nInMillisecs => {
  const nInSecs = nInMillisecs / 1000;
  try {
    let index = findIndex(and(gte(nInSecs), x => nInSecs % x == 0))(
      sortedUnits
    );

    // m by default
    if (!~index) {
      index = 1;
    }

    const symbol = Object.keys(units)[sortedUnits.length - 1 - index];
    const num = nInSecs / units[symbol];
    
    return Result.Ok(Interval(`${num}${symbol}`));
  } catch (err) {
    return Result.Error(toValidationError('Interval parsing', err));
  }
};

module.exports = Interval;
