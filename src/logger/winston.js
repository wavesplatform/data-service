const winston = require('winston');
const { stringify } = require('./utils');
const {
  format: { combine, timestamp, printf },
} = winston;

const myFormat = printf(stringify);
const JSONFormat = combine(timestamp(), myFormat);

const consoleTransport = new winston.transports.Console({
  format: JSONFormat,
});

// Initialization
const createLogger = options =>
  winston.createLogger({
    level: options.logLevel,
    transports: [consoleTransport],
  });

module.exports = createLogger;
