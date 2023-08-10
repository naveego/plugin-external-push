import { LogLevel } from "../proto/publisher_pb";
import _ from 'lodash';

export class Logger {
    logPrefix: string = '';
    fileName: string = '';
    logLevel: LogLevel = LogLevel.INFO;
    
    init(logPath: string) {

    }

    getLevelString(level?: LogLevel) {
        switch(level ?? this.logLevel) {
            case LogLevel.INFO:
                return "INFO";
            case LogLevel.DEBUG:
                return "DEBUG";
            case LogLevel.ERROR:
                return "ERROR";
            case LogLevel.TRACE:
                return "TRACE";
            case LogLevel.WARN:
                return "WARN";
        }
    }

    formatLogMsg(message: string, level?: LogLevel): string {
        return `[${this.getLevelString(level)}] ${message}`;
    }

    formatLogError(error: Error, level?: LogLevel, message?: string): string {
        if (_.isNil(message)) {
            return `[${this.getLevelString(level)}] ${error.stack}`;
        }
        else {
            return `[${this.getLevelString(level)}] ${message+":\n\n"}${error.stack}`;
        }
    }

    Verbose(message: string) {
        if (this.logLevel < LogLevel.TRACE) {
            return;
        }

        console.trace(this.formatLogMsg(message, LogLevel.TRACE));
    }

    Debug(message: string) {
        if (this.logLevel < LogLevel.DEBUG) {
            return;
        }

        console.debug(this.formatLogMsg(message, LogLevel.DEBUG));
    }

    Info(message: string) {
        if (this.logLevel < LogLevel.INFO) {
            return;
        }

        console.log(this.formatLogMsg(message, LogLevel.INFO));
    }

    Error(error: Error, message?: string) {
        if (this.logLevel < LogLevel.ERROR) {
            return;
        }

        if (_.isNil(message)) {
            console.log(this.formatLogError(error, LogLevel.ERROR));
        }
        else {
            console.log(this.formatLogError(error, LogLevel.ERROR, message));
        }
    }

    Warn(message: string) {
        if (this.logLevel < LogLevel.WARN) {
            return;
        }

        console.warn(this.formatLogMsg(message, LogLevel.WARN));
    }

    SetLogLevel(level: LogLevel) {
        this.logLevel = level;
    }

    SetLogPrefix(prefix: string) {
        this.logPrefix = prefix;
    }
}