const { compose, map, tap, curryN } = require('ramda');

const log = curryN(2, (logFn, message, level = 'info') =>
  logFn({ message, level })
);
const tapLog = (logFn, messageFn) => tap(compose(log(logFn), messageFn));
const mapTapLog = compose(map, tapLog);

module.exports = { log, tapLog, mapTapLog };
