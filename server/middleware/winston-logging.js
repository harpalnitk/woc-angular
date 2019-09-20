var winston = require('winston');
require('winston-mongodb');
//winston.emitErrs = true;
const url = 'mongodb://'+process.env.DB_USERNAME+':'+process.env.DB_PASSWORD+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME;
var logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.simple()//json()
    ),
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './server-logs/all-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            prettyPrint: true
        }),
        new winston.transports.MongoDB({
            level: 'warn',
            db: url,
            options: {useNewUrlParser: true }

        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};
