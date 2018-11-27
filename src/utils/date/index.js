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

module.exports = {
  round: roundTo(undefined),
  floor: roundTo('down'),
  ceil: roundTo('up'),
  add,
  subtract,
};
