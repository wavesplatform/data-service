const winston = require('winston');
const {
  format: { combine, timestamp, colorize, printf, align },
} = winston;

const myFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.name ? info.name : ''} ${
    info.message
  }`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(colorize(), timestamp(), align(), myFormat),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

module.exports = async (ctx, next) => {
  ctx.logger = logger;
  await next();
};
