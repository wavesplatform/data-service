const { curry } = require('ramda');

const roundTo = curry((direction, interval, date) => {
  let roundFn;
  switch (direction) {
    case 'up':
      roundFn = a => Math.ceil(a);
      break;
    case 'down':
      roundFn = a => Math.floor(a);
      break;
    default:
      roundFn = a => Math.round(a);
      break;
  }

  let newDate;
  const roundBound = {
    Y: 12,
  };
  if (interval.unit == 'Y') {
    newDate = new Date(date);
    newDate = new Date(
      newDate.setMonth(
        roundFn(newDate.getMonth() / roundBound[interval.unit]) *
          roundBound[interval.unit]
      )
    );
  } else if (interval.unit == 'M') {
    const d = daysInMonth(date.getFullYear(), date.getMonth());
    newDate = new Date(date);
    newDate = new Date(newDate.setUTCDate(roundFn(date.getUTCDate() / d) * d + 1));
  } else {
    newDate = new Date(
      roundFn(date.getTime() / interval.length) * interval.length
    );
  }
  const cleaning = ['Y', 'M', 'd', 'h', 'm', 's'];

  if (cleaning.indexOf(interval.unit) <= cleaning.indexOf('Y')) {
    newDate.setUTCMonth(0);
  }

  if (cleaning.indexOf(interval.unit) <= cleaning.indexOf('M')) {
    newDate.setUTCDate(1);
  }
  
  if (cleaning.indexOf(interval.unit) <= cleaning.indexOf('d')) {
    newDate.setUTCHours(0);
  }
  
  if (cleaning.indexOf(interval.unit) <= cleaning.indexOf('h')) {
    newDate.setUTCMinutes(0);
  }

  if (cleaning.indexOf(interval.unit) <= cleaning.indexOf('m')) {
    newDate.setUTCSeconds(0);
  }

  newDate.setUTCMilliseconds(0);
  
  return newDate;
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

const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

module.exports = {
  round: roundTo(undefined),
  floor: roundTo('down'),
  ceil: roundTo('up'),
  add,
  subtract,
  trunc,
  daysInMonth,
};
