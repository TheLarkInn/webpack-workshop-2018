const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const envConfig = env => require(`./build-utils/webpack.${env.mode}.js`)(env);

module.exports = env => {
  console.log(env);

  return webpackMerge(
    {
      mode: env.mode,
      plugins: [new webpack.ProgressPlugin(), new HtmlWebpackPlugin()]
    },
    envConfig(env)
  );
};
