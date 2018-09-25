"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const constants = require("./constants");
const resolver_1 = require("./resolver");
const utils_1 = require("./utils");
/**
 * Create the TypeScript language service
 */
function makeServicesHost(scriptRegex, log, loader, instance) {
    const { compiler, compilerOptions, files, loaderOptions: { appendTsSuffixTo, appendTsxSuffixTo } } = instance;
    const newLine = compilerOptions.newLine === constants.CarriageReturnLineFeedCode
        ? constants.CarriageReturnLineFeed
        : compilerOptions.newLine === constants.LineFeedCode
            ? constants.LineFeed
            : constants.EOL;
    // make a (sync) resolver that follows webpack's rules
    const resolveSync = resolver_1.makeResolver(loader._compiler.options);
    const readFileWithFallback = (path, encoding) => compiler.sys.readFile(path, encoding) || utils_1.readFile(path, encoding);
    const fileExists = (path) => compiler.sys.fileExists(path) || utils_1.readFile(path) !== undefined;
    const moduleResolutionHost = {
        fileExists,
        readFile: readFileWithFallback,
        realpath: compiler.sys.realpath
    };
    // loader.context seems to work fine on Linux / Mac regardless causes problems for @types resolution on Windows for TypeScript < 2.3
    const getCurrentDirectory = () => loader.context;
    const servicesHost = {
        getProjectVersion: () => `${instance.version}`,
        getScriptFileNames: () => [...files.keys()].filter(filePath => filePath.match(scriptRegex)),
        getScriptVersion: (fileName) => {
            fileName = path.normalize(fileName);
            const file = files.get(fileName);
            return file === undefined ? '' : file.version.toString();
        },
        getScriptSnapshot: (fileName) => {
            // This is called any time TypeScript needs a file's text
            // We either load from memory or from disk
            fileName = path.normalize(fileName);
            let file = files.get(fileName);
            if (file === undefined) {
                const text = utils_1.readFile(fileName);
                if (text === undefined) {
                    return undefined;
                }
                file = { version: 0, text };
                files.set(fileName, file);
            }
            return compiler.ScriptSnapshot.fromString(file.text);
        },
        /**
         * getDirectories is also required for full import and type reference completions.
         * Without it defined, certain completions will not be provided
         */
        getDirectories: compiler.sys.getDirectories,
        /**
         * For @types expansion, these two functions are needed.
         */
        directoryExists: compiler.sys.directoryExists,
        useCaseSensitiveFileNames: () => compiler.sys.useCaseSensitiveFileNames,
        // The following three methods are necessary for @types resolution from TS 2.4.1 onwards see: https://github.com/Microsoft/TypeScript/issues/16772
        fileExists: compiler.sys.fileExists,
        readFile: compiler.sys.readFile,
        readDirectory: compiler.sys.readDirectory,
        getCurrentDirectory,
        getCompilationSettings: () => compilerOptions,
        getDefaultLibFileName: (options) => compiler.getDefaultLibFilePath(options),
        getNewLine: () => newLine,
        trace: log.log,
        log: log.log,
        /* Unclear if this is useful
            resolveTypeReferenceDirectives: (typeDirectiveNames: string[], containingFile: string) =>
                typeDirectiveNames.map(directive =>
                    compiler.resolveTypeReferenceDirective(directive, containingFile, compilerOptions, moduleResolutionHost).resolvedTypeReferenceDirective),
            */
        resolveModuleNames: (moduleNames, containingFile) => resolveModuleNames(resolveSync, moduleResolutionHost, appendTsSuffixTo, appendTsxSuffixTo, scriptRegex, instance, moduleNames, containingFile, resolutionStrategy),
        getCustomTransformers: () => instance.transformers
    };
    return servicesHost;
}
exports.makeServicesHost = makeServicesHost;
/**
 * Create the TypeScript Watch host
 */
function makeWatchHost(scriptRegex, log, loader, instance, appendTsSuffixTo, appendTsxSuffixTo) {
    const { compiler, compilerOptions, files, otherFiles } = instance;
    const newLine = compilerOptions.newLine === constants.CarriageReturnLineFeedCode
        ? constants.CarriageReturnLineFeed
        : compilerOptions.newLine === constants.LineFeedCode
            ? constants.LineFeed
            : constants.EOL;
    // make a (sync) resolver that follows webpack's rules
    const resolveSync = resolver_1.makeResolver(loader._compiler.options);
    const readFileWithFallback = (path, encoding) => compiler.sys.readFile(path, encoding) || utils_1.readFile(path, encoding);
    const moduleResolutionHost = {
        fileExists,
        readFile: readFileWithFallback,
        realpath: compiler.sys.realpath
    };
    // loader.context seems to work fine on Linux / Mac regardless causes problems for @types resolution on Windows for TypeScript < 2.3
    const getCurrentDirectory = () => loader.context;
    const watchedFiles = {};
    const watchedDirectories = {};
    const watchedDirectoriesRecursive = {};
    const watchHost = {
        rootFiles: getRootFileNames(),
        options: compilerOptions,
        useCaseSensitiveFileNames: () => compiler.sys.useCaseSensitiveFileNames,
        getNewLine: () => newLine,
        getCurrentDirectory,
        getDefaultLibFileName: options => compiler.getDefaultLibFilePath(options),
        fileExists,
        readFile: readFileWithCachingText,
        directoryExists: dirPath => compiler.sys.directoryExists(path.normalize(dirPath)),
        getDirectories: dirPath => compiler.sys.getDirectories(path.normalize(dirPath)),
        readDirectory: (dirPath, extensions, exclude, include, depth) => compiler.sys.readDirectory(path.normalize(dirPath), extensions, exclude, include, depth),
        realpath: dirPath => compiler.sys.resolvePath(path.normalize(dirPath)),
        trace: logData => log.log(logData),
        watchFile,
        watchDirectory,
        resolveModuleNames: (moduleNames, containingFile) => resolveModuleNames(resolveSync, moduleResolutionHost, appendTsSuffixTo, appendTsxSuffixTo, scriptRegex, instance, moduleNames, containingFile, resolutionStrategy),
        invokeFileWatcher,
        invokeDirectoryWatcher,
        updateRootFileNames: () => {
            instance.changedFilesList = false;
            if (instance.watchOfFilesAndCompilerOptions) {
                instance.watchOfFilesAndCompilerOptions.updateRootFileNames(getRootFileNames());
            }
        },
        createProgram: compiler.createAbstractBuilder
    };
    return watchHost;
    function getRootFileNames() {
        return [...files.keys()].filter(filePath => filePath.match(scriptRegex));
    }
    function readFileWithCachingText(fileName, encoding) {
        fileName = path.normalize(fileName);
        const file = files.get(fileName) || otherFiles.get(fileName);
        if (file !== undefined) {
            return file.text;
        }
        const text = readFileWithFallback(fileName, encoding);
        if (text === undefined) {
            return undefined;
        }
        otherFiles.set(fileName, { version: 0, text });
        return text;
    }
    function fileExists(fileName) {
        const filePath = path.normalize(fileName);
        return files.has(filePath) || compiler.sys.fileExists(filePath);
    }
    function invokeWatcherCallbacks(callbacks, fileName, eventKind) {
        if (callbacks) {
            // The array copy is made to ensure that even if one of the callback removes the callbacks,
            // we dont miss any callbacks following it
            const cbs = callbacks.slice();
            for (const cb of cbs) {
                cb(fileName, eventKind);
            }
        }
    }
    function invokeFileWatcher(fileName, eventKind) {
        fileName = path.normalize(fileName);
        invokeWatcherCallbacks(watchedFiles[fileName], fileName, eventKind);
    }
    function invokeDirectoryWatcher(directory, fileAddedOrRemoved) {
        directory = path.normalize(directory);
        invokeWatcherCallbacks(watchedDirectories[directory], fileAddedOrRemoved);
        invokeRecursiveDirectoryWatcher(directory, fileAddedOrRemoved);
    }
    function invokeRecursiveDirectoryWatcher(directory, fileAddedOrRemoved) {
        directory = path.normalize(directory);
        invokeWatcherCallbacks(watchedDirectoriesRecursive[directory], fileAddedOrRemoved);
        const basePath = path.dirname(directory);
        if (directory !== basePath) {
            invokeRecursiveDirectoryWatcher(basePath, fileAddedOrRemoved);
        }
    }
    function createWatcher(file, callbacks, callback) {
        file = path.normalize(file);
        const existing = callbacks[file];
        if (existing) {
            existing.push(callback);
        }
        else {
            callbacks[file] = [callback];
        }
        return {
            close: () => {
                const existing = callbacks[file];
                if (existing) {
                    utils_1.unorderedRemoveItem(existing, callback);
                }
            }
        };
    }
    function watchFile(fileName, callback, _pollingInterval) {
        return createWatcher(fileName, watchedFiles, callback);
    }
    function watchDirectory(fileName, callback, recursive) {
        return createWatcher(fileName, recursive ? watchedDirectoriesRecursive : watchedDirectories, callback);
    }
}
exports.makeWatchHost = makeWatchHost;
function resolveModuleNames(resolveSync, moduleResolutionHost, appendTsSuffixTo, appendTsxSuffixTo, scriptRegex, instance, moduleNames, containingFile, resolutionStrategy) {
    const resolvedModules = moduleNames.map(moduleName => resolveModuleName(resolveSync, moduleResolutionHost, appendTsSuffixTo, appendTsxSuffixTo, scriptRegex, instance, moduleName, containingFile, resolutionStrategy));
    populateDependencyGraphs(resolvedModules, instance, containingFile);
    return resolvedModules;
}
function isJsImplementationOfTypings(resolvedModule, tsResolution) {
    return (resolvedModule.resolvedFileName.endsWith('js') &&
        /\.d\.ts$/.test(tsResolution.resolvedFileName));
}
function resolveModuleName(resolveSync, moduleResolutionHost, appendTsSuffixTo, appendTsxSuffixTo, scriptRegex, instance, moduleName, containingFile, resolutionStrategy) {
    const { compiler, compilerOptions } = instance;
    let resolutionResult;
    try {
        const originalFileName = resolveSync(undefined, path.normalize(path.dirname(containingFile)), moduleName);
        const resolvedFileName = appendTsSuffixTo.length > 0 || appendTsxSuffixTo.length > 0
            ? utils_1.appendSuffixesIfMatch({
                '.ts': appendTsSuffixTo,
                '.tsx': appendTsxSuffixTo
            }, originalFileName)
            : originalFileName;
        if (resolvedFileName.match(scriptRegex)) {
            resolutionResult = { resolvedFileName, originalFileName };
        }
    }
    catch (e) { }
    const tsResolution = compiler.resolveModuleName(moduleName, containingFile, compilerOptions, moduleResolutionHost);
    if (tsResolution.resolvedModule !== undefined) {
        const resolvedFileName = path.normalize(tsResolution.resolvedModule.resolvedFileName);
        const tsResolutionResult = {
            originalFileName: resolvedFileName,
            resolvedFileName,
            isExternalLibraryImport: tsResolution.resolvedModule.isExternalLibraryImport
        };
        return resolutionStrategy(resolutionResult, tsResolutionResult);
    }
    return resolutionResult;
}
function resolutionStrategy(resolutionResult, tsResolutionResult) {
    return resolutionResult === undefined ||
        resolutionResult.resolvedFileName ===
            tsResolutionResult.resolvedFileName ||
        isJsImplementationOfTypings(resolutionResult, tsResolutionResult)
        ? tsResolutionResult
        : resolutionResult;
}
function populateDependencyGraphs(resolvedModules, instance, containingFile) {
    resolvedModules = resolvedModules.filter(mod => mod !== null && mod !== undefined);
    instance.dependencyGraph[path.normalize(containingFile)] = resolvedModules;
    resolvedModules.forEach(resolvedModule => {
        if (instance.reverseDependencyGraph[resolvedModule.resolvedFileName] ===
            undefined) {
            instance.reverseDependencyGraph[resolvedModule.resolvedFileName] = {};
        }
        instance.reverseDependencyGraph[resolvedModule.resolvedFileName][path.normalize(containingFile)] = true;
    });
}
