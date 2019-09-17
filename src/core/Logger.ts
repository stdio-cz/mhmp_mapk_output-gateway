/// Setup for logger - uses Winston logger for standard logging output and debug module for debugging logs
import config from "../config/config";

import * as debug from "debug";
import * as logform from "logform";
import * as httpLogger from "morgan";
import * as winston from "winston";

const debugLog: debug.Debugger = debug("golemio:output-gateway");
/**
 * Sets up a Winston logger format - https://www.npmjs.com/package/winston#formats
 */
const logFormat = (info: logform.TransformableInfo): string => {
    return `[${info.timestamp}] [${info.level}]: ${info.message}`;
};

const logLevelToSet = config.log_level ? config.log_level.toLowerCase() : "info";

/**
 * Winston logger setup
 */
const setFormat: logform.Format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.align(),
    winston.format.printf(logFormat),
);

const winstonLogger: winston.Logger = winston.createLogger({
    format: setFormat,
    transports: [
        new winston.transports.Console({ level: logLevelToSet }),
    ],
});

interface ILogger {
    error: winston.LeveledLogMethod;
    warn: winston.LeveledLogMethod;
    info: winston.LeveledLogMethod;

    debug: (formatter: any, ...args: any[]) => void;
    silly: (formatter: any, ...args: any[]) => void;
}

const logger: ILogger = winstonLogger;

const winstonDebugLog = logger.debug;
const winstonSillyLog = logger.silly;

// Log all "SILLY" logs also to debug module
logger.silly = (formatter: any, ...args: any[]): void => {
    debugLog(formatter, args);
    winstonSillyLog(formatter);
};

// Log all "DEBUG" logs also to debug module
logger.debug = (formatter: any, ...args: any[]): void => {
    debugLog(formatter, args);
    winstonDebugLog(formatter);
};

httpLogger.token("date", () => {
    return new Date().toISOString();
});
const getRequestLogger = httpLogger("combined");

export { logger as log, getRequestLogger };
