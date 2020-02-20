const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");
const modeConfig = function(env) {
  return require(`./build-utils/webpack.${env}`)(env);
};

module.exports = function webpackConfig(
  { mode, presets } = {
    mode: "production",
    presets: []
  }
) {
  return webpackMerge(
    {
      mode,
      module: {
        rules: [
          {
            test: /\.jpe?g$/,
            use: [{ loader: "url-loader", options: { limit: 5000 } }]
          }
        ]
      },
      output: {
        filename: "bundle.js"
      },
      plugins: [new HtmlWebpackPlugin(), new webpack.ProgressPlugin()]
    },
    modeConfig(mode)
  );
};
