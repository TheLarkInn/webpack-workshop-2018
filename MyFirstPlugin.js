const MyFirstCompilationPlugin = require("./MyFirstCompilationPlugin");

/** @typedef {import("webpack/lib/Compiler")} Compiler */

class MyFirstPlugin {
  constructor() {
    console.log("HELLLLOOOO INSTANSIATED");
  }

  /**
   * @param {Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.done.tapAsync("MyFirstPlugin", (stats, callback) => {
      console.log(Reflect.ownKeys(stats.compilation.assets).join("\n"));
    });
    compiler.hooks.compilation.tap("MyFirstPlugin", compilation => {
      new MyFirstCompilationPlugin().apply(compilation);
    });
  }
}

module.exports = MyFirstPlugin;
