const winston = require('winston');
require('winston-daily-rotate-file');

const level = process.env.LOG_LEVEL || 'debug';

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level,
      timestamp() {
        return (new Date()).toISOString();
      },
    }),
    new winston.transports.DailyRotateFile({
      filename: `${process.env.LOG_PATH}/globo-store-%DATE%.log`,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

module.exports = logger;
