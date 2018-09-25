import ts = require('typescript');
import tslintTypes = require('tslint');
import FilesRegister = require('./FilesRegister');
import FilesWatcher = require('./FilesWatcher');
import NormalizedMessage = require('./NormalizedMessage');
import CancellationToken = require('./CancellationToken');
import minimatch = require('minimatch');
interface ConfigurationFile extends tslintTypes.Configuration.IConfigurationFile {
    linterOptions?: {
        typeCheck?: boolean;
        exclude?: string[];
    };
}
declare class IncrementalChecker {
    programConfigFile: string;
    linterConfigFile: string | false;
    watchPaths: string[];
    workNumber: number;
    workDivision: number;
    checkSyntacticErrors: boolean;
    files: FilesRegister;
    linter: tslintTypes.Linter;
    linterConfig: ConfigurationFile;
    linterExclusions: minimatch.IMinimatch[];
    program: ts.Program;
    programConfig: ts.ParsedCommandLine;
    watcher: FilesWatcher;
    vue: boolean;
    constructor(programConfigFile: string, linterConfigFile: string | false, watchPaths: string[], workNumber: number, workDivision: number, checkSyntacticErrors: boolean, vue: boolean);
    static loadProgramConfig(configFile: string): ts.ParsedCommandLine;
    static loadLinterConfig(configFile: string): ConfigurationFile;
    static createProgram(programConfig: ts.ParsedCommandLine, files: FilesRegister, watcher: FilesWatcher, oldProgram: ts.Program): ts.Program;
    static createLinter(program: ts.Program): tslintTypes.Linter;
    static isFileExcluded(filePath: string, linterExclusions: minimatch.IMinimatch[]): boolean;
    nextIteration(): void;
    loadVueProgram(): ts.Program;
    loadDefaultProgram(): ts.Program;
    hasLinter(): boolean;
    getDiagnostics(cancellationToken: CancellationToken): NormalizedMessage[];
    getLints(cancellationToken: CancellationToken): NormalizedMessage[];
}
export = IncrementalChecker;
