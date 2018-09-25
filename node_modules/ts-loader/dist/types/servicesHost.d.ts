import * as typescript from 'typescript';
import * as logger from './logger';
import { WatchHost, TSInstance, Webpack } from './interfaces';
/**
 * Create the TypeScript language service
 */
export declare function makeServicesHost(scriptRegex: RegExp, log: logger.Logger, loader: Webpack, instance: TSInstance): typescript.LanguageServiceHost;
/**
 * Create the TypeScript Watch host
 */
export declare function makeWatchHost(scriptRegex: RegExp, log: logger.Logger, loader: Webpack, instance: TSInstance, appendTsSuffixTo: RegExp[], appendTsxSuffixTo: RegExp[]): WatchHost;
