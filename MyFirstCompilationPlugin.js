/** @typedef {import("webpack/lib/Compilation")} Compilation */

class MyFirstCompilationPlugin {
  /**
   * @param {Compilation} compilation
   */
  apply(compilation) {
    compilation.hooks.buildModule.tap("MyFirstModule", module => {
      debugger;
    });
  }
}

module.exports = MyFirstCompilationPlugin;
