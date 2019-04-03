/// Setup for logger - uses Winston logger for standard logging output and debug module for debugging logs
import config from "../config/config";

const debugLog = require("debug")("data-platform:output-gateway");

const winston = require("winston");
const { combine, timestamp, label, printf, prettyPrint, colorize, align } = winston.format;

/**
 * Sets up a Winston logger format - https://www.npmjs.com/package/winston#formats
 */
const logFormat = (info: any) => {
    return `[${info.timestamp}] [${info.level}]: ${info.message}`;
};

const logLevelToSet = config.log_level ? config.log_level.toLowerCase() : "info";

/**
 * Winston logger setup
 */
const setFormat = combine(
        timestamp(),
        colorize(),
        align(),
        printf(logFormat),
    );

const logger = winston.createLogger({
    format: setFormat,
    transports: [
      new winston.transports.Console({ level: logLevelToSet }),
    ],
});

const winstonDebugLog = logger.debug;
const winstonSillyLog = logger.silly;

// Log all "SILLY" logs also to debug module
logger.silly = (logText: any) => {
    debugLog(logText);
    winstonSillyLog(logText);
};

// Log all "DEBUG" logs also to debug module
logger.debug = (logText: any) => {
    debugLog(logText);
    winstonDebugLog(logText);
};

export { logger as log };
