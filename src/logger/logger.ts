import { LogLevel } from '../proto/publisher_pb';
import _ from 'lodash';
import moment from 'moment';
import fsAsync from 'fs/promises';
import fs from 'fs';

type LogEntry = {
    message: string;
    time: number;
};

type LogFormatter = (entry: LogEntry) => string;

class LogBuffer {
    private entries: LogEntry[] = [];
    private outFile: string = '';
    private flushLimit: number = -1;
    private initialized: boolean = false;
    private closed: boolean = false;
    private formatter: LogFormatter;

    constructor() {
        this.formatter = (entry) => `|${moment(entry.time).toISOString()}| ${entry.message}`;
    }

    init(
        outFile: string,
        flushLimit: number = 200,
        formatter?: LogFormatter,
        stderr?: NodeJS.WriteStream
    ): boolean {
        if (this.initialized) return true;

        try {
            fs.appendFileSync(outFile, '', { encoding: 'utf-8' });
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
        if (_.isEmpty(entry.message)) return;

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
                const logLine = `${this.formatter(entry)}`;
                await fsAsync.appendFile(this.outFile, logLine, { encoding: 'utf-8' });
                linesWritten += 1;
            }
            catch (err) {
                process.stderr.write(`Unable to flush: ${err}\n`);
            }
        }

        return linesWritten;
    }

    push(message: string) {
        this.pushImpl({ message, time: moment.now() });
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

export type LogParams = {
    [parameterName: Lowercase<string>]: any;
};

const formatParams = (params: LogParams): LogParams => {
    let formatted: LogParams = {};
    for (const k in params) {
        const lowerKey = _.toLower(k) as Lowercase<string>;
        const lowerTrimmed = k.trim() as Lowercase<string>;
        if (lowerKey !== lowerTrimmed && !_.isUndefined(params[lowerTrimmed]))
            // skip: don't use this key if a value is present
            // for the untrimmed key
            continue;
        else if (_.isUndefined(formatted[lowerKey])) {
            formatted[lowerKey] = params[lowerKey];
        }
    }

    return formatted;
};

export class Logger {
    logPrefix: string = '';
    fileName: string = '';
    logBuffer: LogBuffer;
    logLevel: LogLevel = LogLevel.INFO;
    padLength: number = 80;

    constructor (padLength: number = 80) {
        this.logBuffer = new LogBuffer();
        this.padLength = Math.max(padLength, 50);
    }

    getLevelString(level?: LogLevel) {
        switch(level ?? this.logLevel) {
            case LogLevel.INFO:
                return 'INFO';
            case LogLevel.DEBUG:
                return 'DEBUG';
            case LogLevel.ERROR:
                return 'ERROR';
            case LogLevel.TRACE:
                return 'TRACE';
            case LogLevel.WARN:
                return 'WARN';
        }
    }

    init(logPath: string) {
        this.fileName = logPath;

        if (!this.logBuffer.init(logPath, 200, undefined, process.stderr)) {
            process.stderr.write(`[${this.getLevelString(LogLevel.ERROR)}] Logger | Cannot initialize log buffer`);
        }
    }

    private formatLogMessage = (logLevel: LogLevel, message: string, prefix: string, params?: LogParams): string => {
        let result = `${message}`;
    
        // append prefix if present
        if (!_.isEmpty(prefix)) result = `${prefix} | ${result}`;

        result = `[${this.getLevelString(logLevel)}] ${result}`;
    
        // append parameters if present
        if (!_.isEmpty(params)) {
            let formattedParams = formatParams(params);
            let paramsStr = '';
            for (const key in formattedParams) {
                const k = key as Lowercase<string>;
                const v = formattedParams[k];
    
                let paramSegment: string;
                if (_.isNil(v))
                    paramSegment = 'nil';
                else if (_.isError(v))
                    paramSegment = `${(v.stack ?? v.message).replace(/^Error:\s?/i, '')}\n`;
                else if (_.isString(v))
                    paramSegment = `"${
                        v.replace(/\\/g, '\\\\')
                            .replace(/\"/g, '\\"')
                            .replace(/\'/g, '\\\'')
                            .replace(/\`/g, '\\`')
                    }"`;
                else if (_.isPlainObject(v))
                    paramSegment = `${JSON.stringify(v)}`;
                else
                    paramSegment = `${v}`;
    
                // append to parameters string
                paramsStr = `${paramsStr}${_.isEmpty(paramsStr) ? '' : ' '}${k}=${paramSegment}`;
            }
    
            result = `${result.padEnd(this.padLength - 5)}     ${paramsStr}`;
        }
    
        return `${result}\n`;
    };

    private sendLogMsg(message: string, level: LogLevel, params?: LogParams): void {
        const formattedMessage = this.formatLogMessage(level, message, this.logPrefix, params);
        this.logBuffer.push(formattedMessage);

        if (this.logLevel < level) return;
        process.stderr.write(formattedMessage);
    }

    private sendLogError(error: Error, message?: string, params?: LogParams): void {
        let errorParams = params ?? {};
        errorParams['error'] = error;

        const formattedMessage = this.formatLogMessage(LogLevel.ERROR, message ?? 'Error', this.logPrefix, errorParams);
        this.logBuffer.push(formattedMessage);

        if (this.logLevel < LogLevel.ERROR) return;
        process.stderr.write(formattedMessage);
    }

    Error = (error: Error, message?: string, params?: LogParams) => this.sendLogError(error, message, params);

    Warn = (message: string, params?: LogParams) => this.sendLogMsg(message, LogLevel.WARN, params);

    Info = (message: string, params?: LogParams) => this.sendLogMsg(message, LogLevel.INFO, params);

    Debug = (message: string, params?: LogParams) => this.sendLogMsg(message, LogLevel.DEBUG, params);

    Verbose = (message: string, params?: LogParams) => this.sendLogMsg(message, LogLevel.TRACE, params);

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