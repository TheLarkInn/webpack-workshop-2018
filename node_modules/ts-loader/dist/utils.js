"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const micromatch = require("micromatch");
const constants = require("./constants");
/**
 * The default error formatter.
 */
function defaultErrorFormatter(error, colors) {
    const messageColor = error.severity === 'warning' ? colors.bold.yellow : colors.bold.red;
    return (colors.grey('[tsl] ') +
        messageColor(error.severity.toUpperCase()) +
        (error.file === ''
            ? ''
            : messageColor(' in ') +
                colors.bold.cyan(`${error.file}(${error.line},${error.character})`)) +
        constants.EOL +
        messageColor(`      TS${error.code}: ${error.content}`));
}
/**
 * Take TypeScript errors, parse them and format to webpack errors
 * Optionally adds a file name
 */
function formatErrors(diagnostics, loaderOptions, colors, compiler, merge, context) {
    return diagnostics
        ? diagnostics
            .filter(diagnostic => {
            if (loaderOptions.ignoreDiagnostics.indexOf(diagnostic.code) !== -1) {
                return false;
            }
            if (loaderOptions.reportFiles.length > 0 && diagnostic.file) {
                const relativeFileName = path.relative(context, diagnostic.file.fileName);
                const matchResult = micromatch([relativeFileName], loaderOptions.reportFiles);
                if (matchResult.length === 0) {
                    return false;
                }
            }
            return true;
        })
            .map(diagnostic => {
            const file = diagnostic.file;
            const position = file === undefined
                ? undefined
                : file.getLineAndCharacterOfPosition(diagnostic.start);
            const errorInfo = {
                code: diagnostic.code,
                severity: compiler.DiagnosticCategory[diagnostic.category].toLowerCase(),
                content: compiler.flattenDiagnosticMessageText(diagnostic.messageText, constants.EOL),
                file: file === undefined ? '' : path.normalize(file.fileName),
                line: position === undefined ? 0 : position.line + 1,
                character: position === undefined ? 0 : position.character + 1,
                context
            };
            const message = loaderOptions.errorFormatter === undefined
                ? defaultErrorFormatter(errorInfo, colors)
                : loaderOptions.errorFormatter(errorInfo, colors);
            const error = makeError(message, merge.file === undefined ? errorInfo.file : merge.file, position === undefined
                ? undefined
                : { line: errorInfo.line, character: errorInfo.character });
            return Object.assign(error, merge);
        })
        : [];
}
exports.formatErrors = formatErrors;
function readFile(fileName, encoding = 'utf8') {
    fileName = path.normalize(fileName);
    try {
        return fs.readFileSync(fileName, encoding);
    }
    catch (e) {
        return undefined;
    }
}
exports.readFile = readFile;
function makeError(message, file, location) {
    return {
        message,
        location,
        file,
        loaderSource: 'ts-loader'
    };
}
exports.makeError = makeError;
function appendSuffixIfMatch(patterns, path, suffix) {
    if (patterns.length > 0) {
        for (let regexp of patterns) {
            if (path.match(regexp)) {
                return path + suffix;
            }
        }
    }
    return path;
}
exports.appendSuffixIfMatch = appendSuffixIfMatch;
function appendSuffixesIfMatch(suffixDict, path) {
    for (let suffix in suffixDict) {
        path = appendSuffixIfMatch(suffixDict[suffix], path, suffix);
    }
    return path;
}
exports.appendSuffixesIfMatch = appendSuffixesIfMatch;
function unorderedRemoveItem(array, item) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === item) {
            // Fill in the "hole" left at `index`.
            array[i] = array[array.length - 1];
            array.pop();
            return true;
        }
    }
    return false;
}
exports.unorderedRemoveItem = unorderedRemoveItem;
/**
 * Recursively collect all possible dependants of passed file
 */
function collectAllDependants(reverseDependencyGraph, fileName, collected = {}) {
    const result = {};
    result[fileName] = true;
    collected[fileName] = true;
    const dependants = reverseDependencyGraph[fileName];
    if (dependants !== undefined) {
        Object.keys(dependants).forEach(dependantFileName => {
            if (!collected[dependantFileName]) {
                collectAllDependants(reverseDependencyGraph, dependantFileName, collected).forEach(fName => (result[fName] = true));
            }
        });
    }
    return Object.keys(result);
}
exports.collectAllDependants = collectAllDependants;
/**
 * Recursively collect all possible dependencies of passed file
 */
function collectAllDependencies(dependencyGraph, filePath, collected = {}) {
    const result = {};
    result[filePath] = true;
    collected[filePath] = true;
    let directDependencies = dependencyGraph[filePath];
    if (directDependencies !== undefined) {
        directDependencies.forEach(dependencyModule => {
            if (!collected[dependencyModule.originalFileName]) {
                collectAllDependencies(dependencyGraph, dependencyModule.resolvedFileName, collected).forEach(filePath => (result[filePath] = true));
            }
        });
    }
    return Object.keys(result);
}
exports.collectAllDependencies = collectAllDependencies;
function arrify(val) {
    if (val === null || val === undefined) {
        return [];
    }
    return Array.isArray(val) ? val : [val];
}
exports.arrify = arrify;
