const { curry } = require('ramda');

const roundTo = curry((direction, interval, date) => {
  let roundFn;
  switch (direction) {
    case 'up':
      roundFn = (a, b) => Math.ceil(a, b);
      break;
    case 'down':
      roundFn = (a, b) => Math.floor(a, b);
      break;
    default:
      roundFn = (a, b) => Math.round(a, b);
      break;
  }
  return new Date(roundFn(date.getTime() / interval.length) * interval.length);
});

const add = curry(
  (interval, date) => new Date(date.getTime() + interval.length)
);
const subtract = curry(
  (interval, date) => new Date(date.getTime() - interval.length)
);

/** trunc :: String -> Date -> String */
const trunc = curry((precision, date) => {
  const precisions = {
    year: 4,
    month: 7,
    days: 10,
    hours: 13,
    minutes: 16,
    seconds: 19,
  };
  return date.toISOString().substr(0, precisions[precision]);
});

module.exports = {
  round: roundTo(undefined),
  floor: roundTo('down'),
  ceil: roundTo('up'),
  add,
  subtract,
  trunc,
};
