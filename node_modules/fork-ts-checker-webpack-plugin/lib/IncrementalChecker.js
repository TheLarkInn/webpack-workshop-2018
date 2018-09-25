"use strict";
var fs = require("fs");
var endsWith = require("lodash.endswith");
var path = require("path");
var ts = require("typescript");
var FilesRegister = require("./FilesRegister");
var FilesWatcher = require("./FilesWatcher");
var WorkSet = require("./WorkSet");
var NormalizedMessage = require("./NormalizedMessage");
var minimatch = require("minimatch");
var VueProgram = require("./VueProgram");
var IncrementalChecker = /** @class */ (function () {
    function IncrementalChecker(programConfigFile, linterConfigFile, watchPaths, workNumber, workDivision, checkSyntacticErrors, vue) {
        this.programConfigFile = programConfigFile;
        this.linterConfigFile = linterConfigFile;
        this.watchPaths = watchPaths;
        this.workNumber = workNumber || 0;
        this.workDivision = workDivision || 1;
        this.checkSyntacticErrors = checkSyntacticErrors || false;
        this.vue = vue || false;
        // Use empty array of exclusions in general to avoid having
        // to check of its existence later on.
        this.linterExclusions = [];
        // it's shared between compilations
        this.files = new FilesRegister(function () { return ({
            // data shape
            source: undefined,
            linted: false,
            lints: []
        }); });
    }
    IncrementalChecker.loadProgramConfig = function (configFile) {
        return ts.parseJsonConfigFileContent(
        // Regardless of the setting in the tsconfig.json we want isolatedModules to be false
        Object.assign(ts.readConfigFile(configFile, ts.sys.readFile).config, { isolatedModules: false }), ts.sys, path.dirname(configFile));
    };
    IncrementalChecker.loadLinterConfig = function (configFile) {
        var tslint = require('tslint');
        return tslint.Configuration.loadConfigurationFromPath(configFile);
    };
    IncrementalChecker.createProgram = function (programConfig, files, watcher, oldProgram) {
        var host = ts.createCompilerHost(programConfig.options);
        var realGetSourceFile = host.getSourceFile;
        host.getSourceFile = function (filePath, languageVersion, onError) {
            // first check if watcher is watching file - if not - check it's mtime
            if (!watcher.isWatchingFile(filePath)) {
                try {
                    var stats = fs.statSync(filePath);
                    files.setMtime(filePath, stats.mtime.valueOf());
                }
                catch (e) {
                    // probably file does not exists
                    files.remove(filePath);
                }
            }
            // get source file only if there is no source in files register
            if (!files.has(filePath) || !files.getData(filePath).source) {
                files.mutateData(filePath, function (data) {
                    data.source = realGetSourceFile(filePath, languageVersion, onError);
                });
            }
            return files.getData(filePath).source;
        };
        return ts.createProgram(programConfig.fileNames, programConfig.options, host, oldProgram // re-use old program
        );
    };
    IncrementalChecker.createLinter = function (program) {
        var tslint = require('tslint');
        return new tslint.Linter({ fix: false }, program);
    };
    IncrementalChecker.isFileExcluded = function (filePath, linterExclusions) {
        return endsWith(filePath, '.d.ts') || linterExclusions.some(function (matcher) { return matcher.match(filePath); });
    };
    IncrementalChecker.prototype.nextIteration = function () {
        var _this = this;
        if (!this.watcher) {
            var watchExtensions = this.vue ? ['.ts', '.tsx', '.vue'] : ['.ts', '.tsx'];
            this.watcher = new FilesWatcher(this.watchPaths, watchExtensions);
            // connect watcher with register
            this.watcher.on('change', function (filePath, stats) {
                _this.files.setMtime(filePath, stats.mtime.valueOf());
            });
            this.watcher.on('unlink', function (filePath) {
                _this.files.remove(filePath);
            });
            this.watcher.watch();
        }
        if (!this.linterConfig && this.linterConfigFile) {
            this.linterConfig = IncrementalChecker.loadLinterConfig(this.linterConfigFile);
            if (this.linterConfig.linterOptions && this.linterConfig.linterOptions.exclude) {
                // Pre-build minimatch patterns to avoid additional overhead later on.
                // Note: Resolving the path is required to properly match against the full file paths,
                // and also deals with potential cross-platform problems regarding path separators.
                this.linterExclusions = this.linterConfig.linterOptions.exclude.map(function (pattern) { return new minimatch.Minimatch(path.resolve(pattern)); });
            }
        }
        this.program = this.vue ? this.loadVueProgram() : this.loadDefaultProgram();
        if (this.linterConfig) {
            this.linter = IncrementalChecker.createLinter(this.program);
        }
    };
    IncrementalChecker.prototype.loadVueProgram = function () {
        this.programConfig = this.programConfig || VueProgram.loadProgramConfig(this.programConfigFile);
        return VueProgram.createProgram(this.programConfig, path.dirname(this.programConfigFile), this.files, this.watcher, this.program);
    };
    IncrementalChecker.prototype.loadDefaultProgram = function () {
        this.programConfig = this.programConfig || IncrementalChecker.loadProgramConfig(this.programConfigFile);
        return IncrementalChecker.createProgram(this.programConfig, this.files, this.watcher, this.program);
    };
    IncrementalChecker.prototype.hasLinter = function () {
        return this.linter !== undefined;
    };
    IncrementalChecker.prototype.getDiagnostics = function (cancellationToken) {
        var _this = this;
        var diagnostics = [];
        // select files to check (it's semantic check - we have to include all files :/)
        var filesToCheck = this.program.getSourceFiles();
        // calculate subset of work to do
        var workSet = new WorkSet(filesToCheck, this.workNumber, this.workDivision);
        // check given work set
        workSet.forEach(function (sourceFile) {
            if (cancellationToken) {
                cancellationToken.throwIfCancellationRequested();
            }
            var diagnosticsToRegister = _this.checkSyntacticErrors
                ? []
                    .concat(_this.program.getSemanticDiagnostics(sourceFile, cancellationToken))
                    .concat(_this.program.getSyntacticDiagnostics(sourceFile, cancellationToken))
                : _this.program.getSemanticDiagnostics(sourceFile, cancellationToken);
            diagnostics.push.apply(diagnostics, diagnosticsToRegister);
        });
        // normalize and deduplicate diagnostics
        return NormalizedMessage.deduplicate(diagnostics.map(NormalizedMessage.createFromDiagnostic));
    };
    IncrementalChecker.prototype.getLints = function (cancellationToken) {
        var _this = this;
        if (!this.hasLinter()) {
            throw new Error('Cannot get lints - checker has no linter.');
        }
        // select files to lint
        var filesToLint = this.files.keys().filter(function (filePath) {
            return !_this.files.getData(filePath).linted && !IncrementalChecker.isFileExcluded(filePath, _this.linterExclusions);
        });
        // calculate subset of work to do
        var workSet = new WorkSet(filesToLint, this.workNumber, this.workDivision);
        // lint given work set
        workSet.forEach(function (fileName) {
            cancellationToken.throwIfCancellationRequested();
            try {
                _this.linter.lint(fileName, undefined, _this.linterConfig);
            }
            catch (e) {
                if (fs.existsSync(fileName) &&
                    // check the error type due to file system lag
                    !(e instanceof Error) &&
                    !(e.constructor.name === 'FatalError') &&
                    !(e.message && e.message.trim().startsWith("Invalid source file"))) {
                    // it's not because file doesn't exist - throw error
                    throw e;
                }
            }
        });
        // set lints in files register
        this.linter.getResult().failures.forEach(function (lint) {
            var filePath = lint.getFileName();
            _this.files.mutateData(filePath, function (data) {
                data.linted = true;
                data.lints.push(lint);
            });
        });
        // set all files as linted
        this.files.keys().forEach(function (filePath) {
            _this.files.mutateData(filePath, function (data) {
                data.linted = true;
            });
        });
        // get all lints
        var lints = this.files.keys().reduce(function (innerLints, filePath) {
            return innerLints.concat(_this.files.getData(filePath).lints);
        }, []);
        // normalize and deduplicate lints
        return NormalizedMessage.deduplicate(lints.map(NormalizedMessage.createFromLint));
    };
    return IncrementalChecker;
}());
module.exports = IncrementalChecker;
