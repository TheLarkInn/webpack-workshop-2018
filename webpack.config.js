const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");

const loadPresets = require("./build-utils/loadPresets");
const modeConfig = env => require(`./build-utils/webpack.${env.mode}.js`)(env);

module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
  console.log(mode, presets);
  return webpackMerge(
    {
      mode,
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            use: ["babel-loader"],
            exclude: [/node_modules/]
          },
          {
            test: /\.jpeg$/,
            use: [
              {
                loader: "url-loader",
                options: {
                  limit: 5000
                }
              }
            ]
          }
        ]
      },
      plugins: [new webpack.ProgressPlugin(), new HtmlWebpackPlugin()]
    },
    modeConfig({ mode, presets }),
    loadPresets({ mode, presets })
  );
};
