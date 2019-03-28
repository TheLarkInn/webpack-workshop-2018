const webpack = require("webpack");
const webpackMerge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CPUProfileWebpackPlugin = require("cpuprofile-webpack-plugin");

const loadPresets = require("./build-utils/loadPresets");
const modeConfig = (env) => require(`./build-utils/webpack.${env.mode}.js`)(env)

module.exports = ({ mode, presets } = {mode: "production", presets: [] }) => {
  console.log( mode, presets );

  return webpackMerge({
    mode,
    module: {
      rules: [
        {
          test: /\.png/,
          use: [{loader: 'url-loader', options: {
            limit: 4096
          }}]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin(), new webpack.ProgressPlugin(), new CPUProfileWebpackPlugin(), new webpack.debug.ProfilingPlugin()
    ]
  }, modeConfig({mode, presets}), loadPresets({mode, presets}))
}


