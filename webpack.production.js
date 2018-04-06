const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {GenerateSW} = require("workbox-webpack-plugin");

module.exports = {
    plugins: [
        new MiniCssExtractPlugin(),
        new GenerateSW()
    ],
    module: {
        rules: [
            {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader"
            ]}
        ]
    }
}