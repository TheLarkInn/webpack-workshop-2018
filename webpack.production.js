const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    plugins: [
        new MiniCssExtractPlugin(),
        new WebpackBundleAnalyzer()
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