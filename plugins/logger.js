const { createLogger, transports, format } = require('winston');
const timezoned = () => {
    return new Date().toLocaleString('vn-VI', {
        timeZone: 'Asia/Ho_Chi_Minh'
    });
}

const customFormat = format.combine(format.timestamp({ format: timezoned }), format.printf((info) => {
	return `[${info.timestamp}] - [${info.level.toUpperCase().padEnd(7)}] - [${info.message}]`
}))

const logger = createLogger({
	format: customFormat,
	transports: [
		new transports.Console(),
		new transports.File({
            filename: './logs/springtime.log',
            maxsize: '5,242,880'
        })
	]
});

module.exports = logger;