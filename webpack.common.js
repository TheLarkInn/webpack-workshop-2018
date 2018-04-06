const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].chunk.js"
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.jpg$/,
                use: [
                    {
                        loader: "url-loader", 
                        options: {limit: 10000}
                    }
                ]
            },
            {
                test: /\.js/,
                use: [
                    {
                        loader: "babel-loader",
                        exclude: [/node_modules/]
                    }
                ]
            }
        ]
    }
};