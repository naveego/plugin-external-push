import { LogLevel } from "../proto/publisher_pb";

export class Logger {
    logPrefix: string = '';
    fileName: string = '';
    logLevel: LogLevel = LogLevel.INFO;
    
    init(logPath: string) {

    }

    getLevelString() {
        switch(this.logLevel) {
            case LogLevel.DEBUG:
                return "DEBUG"
            case LogLevel.ERROR:
                return "ERROR"
            case LogLevel.TRACE:
                return "TRACE"
            case LogLevel.WARN:
                return "WARN"
        }
    }

    log(message: string) {
        console.error(`[${this.getLevelString()}] ${message}`)
    }

    Verbose(message: string) {
        if (this.logLevel < LogLevel.TRACE) {
            return;
        }

        this.log(message);
    }

    Debug(message: string) {
        if (this.logLevel < LogLevel.DEBUG) {
            return;
        }

        this.log(message);
    }

    Info(message: string) {
        if (this.logLevel < LogLevel.INFO) {
            return;
        }

        this.log(message);
    }

    Error(message: string) {
        if (this.logLevel < LogLevel.ERROR) {
            return;
        }

        this.log(message);
    }

    SetLogLevel(level: LogLevel) {
        this.logLevel = level;
    }

    SetLogPrefix(prefix: string) {
        this.logPrefix = prefix;
    }
}