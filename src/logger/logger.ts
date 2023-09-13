import { LogLevel } from "../proto/publisher_pb";
import _ from 'lodash';
import moment from 'moment';
import fsAsync from 'fs/promises';
import fs from 'fs';

type LogFormatter = (entry: LogEntry) => string;

const logLevelFormatter = (logLevel: LogLevel): string => {
    switch (logLevel) {
        case LogLevel.ERROR: return 'ERROR';
        case LogLevel.WARN: return 'WARN';
        case LogLevel.INFO: return 'INFO';
        case LogLevel.DEBUG: return 'DEBUG';
        case LogLevel.TRACE: return 'TRACE';
    }
};

class LogBuffer {
    private entries: LogEntry[] = [];
    private outFile: string = "";
    private flushLimit: number = -1;
    private initialized: boolean = false;
    private closed: boolean = false;
    private formatter: LogFormatter;

    constructor() {
        this.formatter = (entry) => {
            let levelStr = `[${moment(entry.time).toISOString()}] <${logLevelFormatter(entry.level)}>`;
            if (!_.isNil(entry.error)) {
                let msg = _.isEmpty(entry.message) ? 'Error' : entry.message;
                return `${levelStr} ${msg} error=${entry.error.stack}`;
            }
            else {
                return `${levelStr} ${entry.message}`;
            }
        };
    }

    init(
        outFile: string,
        flushLimit: number = 200,
        formatter?: LogFormatter,
        stderr?: NodeJS.WriteStream
    ): boolean {
        if (this.initialized) return true;

        try {
            fs.appendFileSync(outFile, "", { encoding: 'utf-8' });
            this.initialized = true;
            this.outFile = outFile;
            this.flushLimit = flushLimit;

            if (!_.isNil(formatter)) {
                this.formatter = formatter;
            }
        }
        catch (err) {
            this.initialized = false;
            if (!_.isNil(stderr)) {
                stderr.write(`WARNING: LogBuffer not initialized - ${err}\n`);
            }
        }

        return this.initialized;
    }

    private pushImpl(entry: LogEntry): void {
        if (this.closed) throw new Error('Can\'t push: Buffer is closed');
        if (_.isNil(entry.error) && _.isEmpty(entry.message)) return;

        // add entry and flush if ready
        this.entries.push(entry);
        if (this.entries.length >= this.flushLimit) {
            this.flushImpl();
        }
    }

    private async flushImpl(): Promise<number> {
        if (this.flushLimit <= 0 || this.closed) return -1;

        // pull items eq. to flush limit off the logger
        // (but no more than entries length)
        const entriesToWrite: LogEntry[] = this.entries.splice(
            0, Math.min(this.flushLimit, this.entries.length)
        );

        // sort entries from oldest to newest
        const sortedEntries = entriesToWrite.sort((a, b) => a.time - b.time);
        let linesWritten = 0;
        for (let i = 0; i < sortedEntries.length; i++) {
            try {
                const entry = sortedEntries[i];
                const logLine = `${this.formatter(entry)}\n`;
                await fsAsync.appendFile(this.outFile, logLine, { encoding: 'utf-8' });
                linesWritten += 1;
            }
            catch (err) {
                process.stderr.write(`Unable to flush: ${err}\n`);
            }
        }

        return linesWritten;
    }

    private formatMessage(message: string, prefix: string = ''): string {
        let msg = `${message}`;
        if (!_.isEmpty(prefix)) {
            msg = `${prefix} | ${msg}`;
        }
        return msg;
    }

    push(level: LogLevel, msg: string, prefix: string = '') {
        let message = this.formatMessage(msg, prefix);
        this.pushImpl({ level, message, time: moment.now() });
    }

    pushError(error: Error, msg: string, prefix?: string) {
        let message = this.formatMessage(msg, prefix);
        this.pushImpl({ level: LogLevel.ERROR, message, error, time: moment.now() });
    }

    async closeAndFlush(): Promise<number> {
        if (this.closed) return 0;
        
        let flushedCount = await this.flushImpl();
        this.closed = true;

        return flushedCount;
    }

    async flush(): Promise<number> {
        return await this.flushImpl();
    }
}

type LogEntry = {
    level: LogLevel;
    message: string;
    time: number;
    error?: Error;
};

export class Logger {
    logPrefix: string = '';
    fileName: string = '';
    logBuffer: LogBuffer;
    logLevel: LogLevel = LogLevel.INFO;

    constructor () {
        this.logBuffer = new LogBuffer();
    }

    init(logPath: string) {
        this.fileName = logPath;

        if (!this.logBuffer.init(logPath, 200, undefined, process.stderr)) {
            process.stderr.write('[ERROR] Logger | Cannot initialize log buffer');
        }
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

    private formatLogPrefix = (): string => !_.isNil(this.logPrefix) ? `${this.logPrefix} | ` : "";

    private sendLogMsg(message: string, level: LogLevel): void {
        const prefix = this.formatLogPrefix();
        process.stderr.write(`[${this.getLevelString(level)}] ${prefix}${message}\n`);
        this.logBuffer.push(level, message, this.logPrefix);
    }

    private sendLogError(error: Error, level?: LogLevel, message?: string): void {
        const prefix = this.formatLogPrefix();
        if (_.isNil(message)) {
            process.stderr.write(`[${this.getLevelString(level)}] ${prefix}${error.stack}\n`);
        }
        else {
            process.stderr.write(`[${this.getLevelString(level)}] ${prefix}${message+":\n\n"}${error.stack}\n`);
        }

        this.logBuffer.pushError(error, message ?? "", this.logPrefix);
    }

    Verbose(message: string) {
        if (this.logLevel < LogLevel.TRACE) {
            return;
        }

        this.sendLogMsg(message, LogLevel.TRACE);
    }

    Debug(message: string) {
        if (this.logLevel < LogLevel.DEBUG) {
            return;
        }

        this.sendLogMsg(message, LogLevel.DEBUG);
    }

    Info(message: string) {
        if (this.logLevel < LogLevel.INFO) {
            return;
        }

        this.sendLogMsg(message, LogLevel.INFO);
    }

    Error(error: Error, message?: string) {
        if (this.logLevel < LogLevel.ERROR) {
            return;
        }

        this.sendLogError(error, LogLevel.ERROR, message);
    }

    Warn(message: string) {
        if (this.logLevel < LogLevel.WARN) {
            return;
        }

        this.sendLogMsg(message, LogLevel.WARN);
    }

    SetLogLevel(level: LogLevel) {
        this.logLevel = level;
    }

    SetLogPrefix(prefix: string) {
        this.logPrefix = prefix.trim();
    }

    Flush() {
        this.logBuffer.flush();
    }

    CloseAndFlush() {
        this.logBuffer.closeAndFlush();
    }
}