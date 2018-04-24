const winston = require('winston');
const chalk = require('chalk');
// Delimiter
const D = '\t|\t';

const {
  format: { combine, timestamp, colorize, printf, json },
} = winston;

const myFormat = printf(({ level, timestamp, requestId, options, message }) => {
  const commonPart = `${level}${D}${timestamp}${D}${chalk.yellow(requestId)}`;

  if (level.match(/error/)) {
    const { error, meta, type } = options.error;

    return `${commonPart}${D}${chalk.red(type)}${D}${
      error.message
    }${D}${JSON.stringify(meta)}
    ${error.stack}`;
  }

  return `${commonPart}${D}${message}${D}${JSON.stringify(options)}`;
});

const consoleFormat = combine(colorize(), timestamp(), myFormat);
const fileFormat = combine(timestamp(), json());

const logger = winston.createLogger({
  level: 'info',

  transports: [
    new winston.transports.File({
      filename: 'combined.log',
      format: fileFormat,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ format: consoleFormat }));
}

module.exports = logger;
