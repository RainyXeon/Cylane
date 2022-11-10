const { createLogger, transports, format, addColors } = require('winston');
const { combine, timestamp, prettyPrint, printf, colorize } = format;
const moment = require("moment");

const timezoned = () => {
    return moment().format("DD-MM-YYYY hh:mm:ss")
}

const customFormat = format.combine(timestamp({ format: timezoned }), printf((info) => {
	return `${info.timestamp} - ${info.level.toUpperCase().padEnd(7)} - ${info.message}`
}), colorize({ all: true }))

const fileFormat = format.combine(
  timestamp({ format: timezoned }),
  prettyPrint(),
)

addColors({
  info: 'cyan',
  warn: 'white yellowBG',
  error: 'white redBG',
  debug: 'green',
});

const logger = createLogger({
	transports: [
		new transports.Console({
      format: customFormat,
    }),

    new transports.Console({
      level: 'error',
      format: fileFormat,
    }),

    new transports.File({
      level: 'info',
      filename: './logs/info.log',
      format: fileFormat
    }),

    new transports.File({
      level: 'error',
      filename: './logs/error.log',
      format: fileFormat
    }),

    new transports.File({
      level: 'warn',
      filename: './logs/warn.log',
      format: fileFormat
    }),
	]
});

module.exports = logger;