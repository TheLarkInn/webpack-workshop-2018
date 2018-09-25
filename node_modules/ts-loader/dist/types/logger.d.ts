import { LoaderOptions } from './interfaces';
import { Chalk } from 'chalk';
declare type LoggerFunc = (message: string) => void;
export interface Logger {
    log: LoggerFunc;
    logInfo: LoggerFunc;
    logWarning: LoggerFunc;
    logError: LoggerFunc;
}
export declare function makeLogger(loaderOptions: LoaderOptions, colors: Chalk): Logger;
export {};
