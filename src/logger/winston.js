const winston = require('winston');
const { omit, compose } = require('ramda');
const { stringify } = require('./utils');
const {
  format: { combine, timestamp, printf },
} = winston;
const omitLevel = omit(['level']);

const myFormat = printf(compose(stringify, omitLevel));
const JSONFormat = combine(timestamp(), myFormat);

const consoleTransport = new winston.transports.Console({
  format: JSONFormat,
});

// Initialization
const createLogger = () =>
  winston.createLogger({
    level: 'debug',
    transports: [consoleTransport],
  });

module.exports = createLogger;
