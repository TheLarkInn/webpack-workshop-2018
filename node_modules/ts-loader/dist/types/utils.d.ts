import * as typescript from 'typescript';
import { Chalk } from 'chalk';
import { DependencyGraph, LoaderOptions, ReverseDependencyGraph, WebpackError, WebpackModule } from './interfaces';
/**
 * Take TypeScript errors, parse them and format to webpack errors
 * Optionally adds a file name
 */
export declare function formatErrors(diagnostics: ReadonlyArray<typescript.Diagnostic> | undefined, loaderOptions: LoaderOptions, colors: Chalk, compiler: typeof typescript, merge: {
    file?: string;
    module?: WebpackModule;
}, context: string): WebpackError[];
export declare function readFile(fileName: string, encoding?: string | undefined): string | undefined;
export declare function makeError(message: string, file: string | undefined, location?: {
    line: number;
    character: number;
}): WebpackError;
export declare function appendSuffixIfMatch(patterns: RegExp[], path: string, suffix: string): string;
export declare function appendSuffixesIfMatch(suffixDict: {
    [suffix: string]: RegExp[];
}, path: string): string;
export declare function unorderedRemoveItem<T>(array: T[], item: T): boolean;
/**
 * Recursively collect all possible dependants of passed file
 */
export declare function collectAllDependants(reverseDependencyGraph: ReverseDependencyGraph, fileName: string, collected?: {
    [file: string]: boolean;
}): string[];
/**
 * Recursively collect all possible dependencies of passed file
 */
export declare function collectAllDependencies(dependencyGraph: DependencyGraph, filePath: string, collected?: {
    [file: string]: boolean;
}): string[];
export declare function arrify<T>(val: T | T[]): T[];
