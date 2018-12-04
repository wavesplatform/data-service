const { compose, curryN } = require('ramda');

const setMilliseconds = curryN(2, (ms, dateTime) => new Date(dateTime.setMilliseconds(ms)));
const setSeconds = curryN(2, (sec, dateTime) => new Date(dateTime.setSeconds(sec)));
const incMinutes = curryN(2, (min, dateTime) => new Date(dateTime.getTime() + 60 * 1000 + min));

module.exports = {
  truncMilliseconds: setMilliseconds(0),
  truncSeconds: compose(setSeconds(0), setMilliseconds(0)),
  fillSeconds: compose(incMinutes(1), setSeconds(0), setMilliseconds(0))
};
