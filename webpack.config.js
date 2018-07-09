const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => {
  console.log(env);

  return {
    mode: env.mode,
    plugins: [new webpack.ProgressPlugin(), new HtmlWebpackPlugin()]
  };
};
