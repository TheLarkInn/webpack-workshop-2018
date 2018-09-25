import ts = require('typescript');
import FilesRegister = require('./FilesRegister');
import FilesWatcher = require('./FilesWatcher');
interface ResolvedScript {
    scriptKind: ts.ScriptKind;
    content: string;
}
declare class VueProgram {
    static loadProgramConfig(configFile: string): ts.ParsedCommandLine;
    /**
     * Search for default wildcard or wildcard from options, we only search for that in tsconfig CompilerOptions.paths.
     * The path is resolved with thie given substitution and includes the CompilerOptions.baseUrl (if given).
     * If no paths given in tsconfig, then the default substitution is '[tsconfig directory]/src'.
     * (This is a fast, simplified inspiration of what's described here: https://github.com/Microsoft/TypeScript/issues/5039)
     */
    static resolveNonTsModuleName(moduleName: string, containingFile: string, basedir: string, options: ts.CompilerOptions): string;
    static isVue(filePath: string): boolean;
    static createProgram(programConfig: ts.ParsedCommandLine, basedir: string, files: FilesRegister, watcher: FilesWatcher, oldProgram: ts.Program): ts.Program;
    private static getScriptKindByLang;
    static resolveScriptBlock(content: string): ResolvedScript;
}
export = VueProgram;
