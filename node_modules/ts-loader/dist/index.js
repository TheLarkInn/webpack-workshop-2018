"use strict";
const path = require("path");
const loaderUtils = require("loader-utils");
const instances_1 = require("./instances");
const utils_1 = require("./utils");
const constants = require("./constants");
const webpackInstances = [];
const loaderOptionsCache = {};
/**
 * The entry point for ts-loader
 */
function loader(contents) {
    this.cacheable && this.cacheable();
    const callback = this.async();
    const options = getLoaderOptions(this);
    const instanceOrError = instances_1.getTypeScriptInstance(options, this);
    if (instanceOrError.error !== undefined) {
        callback(new Error(instanceOrError.error.message));
        return;
    }
    return successLoader(this, contents, callback, options, instanceOrError.instance);
}
function successLoader(loader, contents, callback, options, instance) {
    const rawFilePath = path.normalize(loader.resourcePath);
    const filePath = options.appendTsSuffixTo.length > 0 || options.appendTsxSuffixTo.length > 0
        ? utils_1.appendSuffixesIfMatch({
            '.ts': options.appendTsSuffixTo,
            '.tsx': options.appendTsxSuffixTo
        }, rawFilePath)
        : rawFilePath;
    const fileVersion = updateFileInCache(filePath, contents, instance);
    const { outputText, sourceMapText } = options.transpileOnly
        ? getTranspilationEmit(filePath, contents, instance, loader)
        : getEmit(rawFilePath, filePath, instance, loader);
    if (outputText === null || outputText === undefined) {
        const additionalGuidance = !options.allowTsInNodeModules && filePath.indexOf('node_modules') !== -1
            ? ' By default, ts-loader will not compile .ts files in node_modules.\n' +
                'You should not need to recompile .ts files there, but if you really want to, use the allowTsInNodeModules option.\n' +
                'See: https://github.com/Microsoft/TypeScript/issues/12358'
            : '';
        throw new Error(`Typescript emitted no output for ${filePath}.${additionalGuidance}`);
    }
    const { sourceMap, output } = makeSourceMap(sourceMapText, outputText, filePath, contents, loader);
    // _module.meta is not available inside happypack
    if (!options.happyPackMode) {
        // Make sure webpack is aware that even though the emitted JavaScript may be the same as
        // a previously cached version the TypeScript may be different and therefore should be
        // treated as new
        loader._module.buildMeta.tsLoaderFileVersion = fileVersion;
    }
    callback(null, output, sourceMap);
}
/**
 * either retrieves loader options from the cache
 * or creates them, adds them to the cache and returns
 */
function getLoaderOptions(loader) {
    // differentiate the TypeScript instance based on the webpack instance
    let webpackIndex = webpackInstances.indexOf(loader._compiler);
    if (webpackIndex === -1) {
        webpackIndex = webpackInstances.push(loader._compiler) - 1;
    }
    const loaderOptions = loaderUtils.getOptions(loader) || {};
    const instanceName = webpackIndex + '_' + (loaderOptions.instance || 'default');
    if (!loaderOptionsCache.hasOwnProperty(instanceName)) {
        loaderOptionsCache[instanceName] = new WeakMap();
    }
    const cache = loaderOptionsCache[instanceName];
    if (cache.has(loaderOptions)) {
        return cache.get(loaderOptions);
    }
    validateLoaderOptions(loaderOptions);
    const options = makeLoaderOptions(instanceName, loaderOptions);
    cache.set(loaderOptions, options);
    return options;
}
const validLoaderOptions = [
    'silent',
    'logLevel',
    'logInfoToStdOut',
    'instance',
    'compiler',
    'context',
    'configFile',
    'transpileOnly',
    'ignoreDiagnostics',
    'errorFormatter',
    'colors',
    'compilerOptions',
    'appendTsSuffixTo',
    'appendTsxSuffixTo',
    'onlyCompileBundledFiles',
    'happyPackMode',
    'getCustomTransformers',
    'reportFiles',
    'experimentalWatchApi',
    'allowTsInNodeModules'
];
/**
 * Validate the supplied loader options.
 * At present this validates the option names only; in future we may look at validating the values too
 * @param loaderOptions
 */
function validateLoaderOptions(loaderOptions) {
    const loaderOptionKeys = Object.keys(loaderOptions);
    for (let i = 0; i < loaderOptionKeys.length; i++) {
        const option = loaderOptionKeys[i];
        const isUnexpectedOption = validLoaderOptions.indexOf(option) === -1;
        if (isUnexpectedOption) {
            throw new Error(`ts-loader was supplied with an unexpected loader option: ${option}

Please take a look at the options you are supplying; the following are valid options:
${validLoaderOptions.join(' / ')}
`);
        }
    }
    if (loaderOptions.context && !path.isAbsolute(loaderOptions.context)) {
        throw new Error(`Option 'context' has to be an absolute path. Given '${loaderOptions.context}'.`);
    }
}
function makeLoaderOptions(instanceName, loaderOptions) {
    const options = Object.assign({}, {
        silent: false,
        logLevel: 'WARN',
        logInfoToStdOut: false,
        compiler: 'typescript',
        configFile: 'tsconfig.json',
        context: undefined,
        transpileOnly: false,
        compilerOptions: {},
        appendTsSuffixTo: [],
        appendTsxSuffixTo: [],
        transformers: {},
        happyPackMode: false,
        colors: true,
        onlyCompileBundledFiles: false,
        reportFiles: [],
        // When the watch API usage stabilises look to remove this option and make watch usage the default behaviour when available
        experimentalWatchApi: false,
        allowTsInNodeModules: false
    }, loaderOptions);
    options.ignoreDiagnostics = utils_1.arrify(options.ignoreDiagnostics).map(Number);
    options.logLevel = options.logLevel.toUpperCase();
    options.instance = instanceName;
    // happypack can be used only together with transpileOnly mode
    options.transpileOnly = options.happyPackMode ? true : options.transpileOnly;
    return options;
}
/**
 * Either add file to the overall files cache or update it in the cache when the file contents have changed
 * Also add the file to the modified files
 */
function updateFileInCache(filePath, contents, instance) {
    let fileWatcherEventKind;
    // Update file contents
    let file = instance.files.get(filePath);
    if (file === undefined) {
        file = instance.otherFiles.get(filePath);
        if (file !== undefined) {
            instance.otherFiles.delete(filePath);
            instance.files.set(filePath, file);
        }
        else {
            if (instance.watchHost) {
                fileWatcherEventKind = instance.compiler.FileWatcherEventKind.Created;
            }
            file = { version: 0 };
            instance.files.set(filePath, file);
        }
        instance.changedFilesList = true;
    }
    if (instance.watchHost && contents === undefined) {
        fileWatcherEventKind = instance.compiler.FileWatcherEventKind.Deleted;
    }
    if (file.text !== contents) {
        file.version++;
        file.text = contents;
        instance.version++;
        if (instance.watchHost && fileWatcherEventKind === undefined) {
            fileWatcherEventKind = instance.compiler.FileWatcherEventKind.Changed;
        }
    }
    if (instance.watchHost && fileWatcherEventKind !== undefined) {
        instance.hasUnaccountedModifiedFiles = true;
        instance.watchHost.invokeFileWatcher(filePath, fileWatcherEventKind);
        instance.watchHost.invokeDirectoryWatcher(path.dirname(filePath), filePath);
    }
    // push this file to modified files hash.
    if (instance.modifiedFiles === null || instance.modifiedFiles === undefined) {
        instance.modifiedFiles = new Map();
    }
    instance.modifiedFiles.set(filePath, file);
    return file.version;
}
function getEmit(rawFilePath, filePath, instance, loader) {
    const outputFiles = instances_1.getEmitOutput(instance, filePath);
    loader.clearDependencies();
    loader.addDependency(rawFilePath);
    const allDefinitionFiles = [...instance.files.keys()].filter(defFilePath => defFilePath.match(constants.dtsDtsxOrDtsDtsxMapRegex));
    // Make this file dependent on *all* definition files in the program
    const addDependency = loader.addDependency.bind(loader);
    allDefinitionFiles.forEach(addDependency);
    // Additionally make this file dependent on all imported files
    const fileDependencies = instance.dependencyGraph[filePath];
    const additionalDependencies = fileDependencies === undefined
        ? []
        : fileDependencies.map(module => module.originalFileName);
    if (additionalDependencies) {
        additionalDependencies.forEach(addDependency);
    }
    loader._module.buildMeta.tsLoaderDefinitionFileVersions = allDefinitionFiles
        .concat(additionalDependencies)
        .map(defFilePath => defFilePath +
        '@' +
        (instance.files.get(defFilePath) || { version: '?' }).version);
    const outputFile = outputFiles
        .filter(outputFile => outputFile.name.match(constants.jsJsx))
        .pop();
    const outputText = outputFile ? outputFile.text : undefined;
    const sourceMapFile = outputFiles
        .filter(outputFile => outputFile.name.match(constants.jsJsxMap))
        .pop();
    const sourceMapText = sourceMapFile ? sourceMapFile.text : undefined;
    return { outputText, sourceMapText };
}
/**
 * Transpile file
 */
function getTranspilationEmit(filePath, contents, instance, loader) {
    const fileName = path.basename(filePath);
    const { outputText, sourceMapText, diagnostics } = instance.compiler.transpileModule(contents, {
        compilerOptions: Object.assign({}, instance.compilerOptions, { rootDir: undefined }),
        transformers: instance.transformers,
        reportDiagnostics: true,
        fileName
    });
    // _module.errors is not available inside happypack - see https://github.com/TypeStrong/ts-loader/issues/336
    if (!instance.loaderOptions.happyPackMode) {
        const errors = utils_1.formatErrors(diagnostics, instance.loaderOptions, instance.colors, instance.compiler, { module: loader._module }, loader.context);
        loader._module.errors.push(...errors);
    }
    return { outputText, sourceMapText };
}
function makeSourceMap(sourceMapText, outputText, filePath, contents, loader) {
    if (sourceMapText === undefined) {
        return { output: outputText, sourceMap: undefined };
    }
    return {
        output: outputText.replace(/^\/\/# sourceMappingURL=[^\r\n]*/gm, ''),
        sourceMap: Object.assign(JSON.parse(sourceMapText), {
            sources: [loaderUtils.getRemainingRequest(loader)],
            file: filePath,
            sourcesContent: [contents]
        })
    };
}
module.exports = loader;
