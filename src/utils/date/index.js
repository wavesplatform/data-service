const { curry } = require('ramda');

const roundTo = curry((direction, interval, date) => {
  let roundFn;
  switch (direction) {
    case 'up':
      roundFn = Math.ceil;
      break;
    case 'down':
      roundFn = Math.floor;
      break;
    default:
      roundFn = Math.round;
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

// const roundToMinuteUp = d => {
//   const coeff = 1000 * 60;
//   return new Date(Math.ceil(d.getTime() / coeff) * coeff);
// };

// const getIntervalStart = timeStart => minutesInInterval => {
//   const offset = timeStart.getTime();
//   const coeff = 1000 * 60 * minutesInInterval;
//   return new Date(Math.ceil(d.getTime() / coeff) * coeff);
// };
