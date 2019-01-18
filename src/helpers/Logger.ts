const debugLog = require("debug")("data-platform:output-gateway");

const config = require("../config/config");


const winston = require('winston');
const { combine, timestamp, label, printf, prettyPrint, colorize, align } = winston.format;


const logFormat = (info: any) => {
    return `[${info.timestamp}] [${info.level}]: ${info.message}`;
}

const logLevelToSet = config.log_level ? config.log_level.toLowerCase() : "info";

/**
 * Winston logger to provide levels
 */
const logger = winston.createLogger({
    format: combine(
        timestamp(),
        colorize(),
        align(),
        printf(logFormat)
      ),
    transports: [
      new winston.transports.Console({ logLevelToSet }),
    ]
});

const winstonDebugLog = logger.debug;
logger.debug = (logText:any) => {
    debugLog(logText);
    winstonDebugLog(logText);
}

export default logger;