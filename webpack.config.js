const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const loadPresets = require("./build-utils/loadPresets");
const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);

module.exports = ({ mode, presets } = { mode: "production", presets: [] }) =>
  webpackMerge(
    {
      mode,
      plugins: [new webpack.ProgressPlugin()]
    },
    modeConfig(mode),
    loadPresets({ mode, presets })
  );
