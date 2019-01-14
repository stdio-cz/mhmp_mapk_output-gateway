const debugLog = require("debug")("data-platform:output-gateway:debug");
const infoLog = require("debug")("data-platform:output-gateway:info");
const warnLog = require("debug")("data-platform:output-gateway:warning");
const errorLog = require("debug")("data-platform:output-gateway:error");

const config = require("../config/config");

/**
 * Define standard log levels
 */
const logLevels: any = {
    "ALL": 0,
    "DEBUG": 1,
    "INFO": 2,
    "WARN": 3,
    "ERROR": 4,
    "FATAL": 5,
    "OFF": 6
}

export class Logger {
    public debug = (logText: any): void => {
        if (config.log_level === undefined || logLevels[config.log_level] <= logLevels["DEBUG"]) {
            return debugLog(logText);
        }
    }

    public info = (logText: any): void => {
        if (config.log_level === undefined || logLevels[config.log_level] <= logLevels["INFO"]) {
            return infoLog(logText);
        }
    }

    public warn = (logText: any): void => {
        if (config.log_level === undefined || logLevels[config.log_level] <= logLevels["WARN"]) {
            return warnLog(logText);
        }
    }

    public error = (logText: any): void => {
        if (config.log_level === undefined || logLevels[config.log_level] <= logLevels["ERROR"]) {
            return errorLog(logText);
        }
    }

    public fatal = (logText: any): void => {
        if (config.log_level === undefined || logLevels[config.log_level] <= logLevels["FATAL"]) {
            return errorLog(logText);
        }
    }
}

export default new Logger();