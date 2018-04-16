const webpackMerge = require("webpack-merge");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = env => {
  return webpackMerge(
    // A presets common configuration details
    {
      target: "node",
      resolve: {
        extensions: [".ts", ".tsx", ".wasm", ".mjs", ".js", ".json"]
      },
      module: {
        rules: [
          {
            test: /\.tsx?/,
            use: [
              {
                loader: "ts-loader",
                options: {
                  transpileOnly: true
                }
              }
            ]
          }
        ]
      },
      plugins: [new ForkTsCheckerWebpackPlugin()]
    },
    // Any mode specific capabilities for that preset
    { production: {}, development: {} }[env.mode]
  );
};
