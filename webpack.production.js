const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
    plugins: [
        new MiniCssExtractPlugin(),
        new webpack.optimize.AggressiveSplittingPlugin({
            minSize: 1000,
            maxSize: 6000
        })
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