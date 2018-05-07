const winston = require('winston');
const { omit } = require('ramda');

// Delimiter

const {
  format: { combine, timestamp, printf },
} = winston;
const omitLevel = omit(['level']);
const myFormat = printf(obj => JSON.stringify(omitLevel(obj)));
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
