const winston = require('winston');
// Delimiter
const D = '\t|\t';

const {
  format: { combine, timestamp, colorize, printf },
} = winston;

const myFormat = printf(({ level, timestamp, requestId, options, message }) => {
  const commonPart = `${level}${D}${timestamp}${D}${requestId}`;

  if (level.match(/error/)) {
    const { error, meta, type } = options.error;

    return `${commonPart}${D}${type}${D}${error.message}${D}${JSON.stringify(
      meta
    )}
    ${error.stack}`;
  }

  return `${commonPart}${D}${message}${D}${JSON.stringify(options)}`;
});

const consoleFormat = combine(colorize(), timestamp(), myFormat);
const fileFormat = combine(timestamp(), myFormat);

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
