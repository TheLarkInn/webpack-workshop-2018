const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = ({mode}) => {
  console.log(mode);

  return {
    mode,
    plugins: [
      new HtmlWebpackPlugin()
    ]
  }
}

