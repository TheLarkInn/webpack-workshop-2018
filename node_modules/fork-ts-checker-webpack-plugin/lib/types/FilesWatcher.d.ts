import chokidar = require('chokidar');
declare class FilesWatcher {
    watchPaths: string[];
    watchExtensions: string[];
    watchers: chokidar.FSWatcher[];
    listeners: {
        [eventName: string]: Function[];
    };
    constructor(watchPaths: string[], watchExtensions: string[]);
    isFileSupported(filePath: string): boolean;
    watch(): void;
    isWatchingFile(filePath: string): boolean;
    isWatching(): boolean;
    on(event: string, listener: Function): void;
    off(event: string, listener: Function): void;
}
export = FilesWatcher;
