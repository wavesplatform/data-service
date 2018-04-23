const winston = require('winston');
const {
  format: { combine, timestamp, colorize, printf, align },
} = winston;

const myFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.name ? info.name : ''} ${
    info.message
  }`;
});
const consoleFormat = combine(colorize(), timestamp(), align(), myFormat);
const fileFormat = combine(timestamp(), align(), myFormat);
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

module.exports = async (ctx, next) => {
  ctx.log = logger.log.bind(logger);
  await next();
};
