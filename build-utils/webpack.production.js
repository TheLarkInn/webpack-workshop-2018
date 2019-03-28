const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = () => ({
    output: {
        filename: "[hash].chunk.js",
        chunkFilename: "[hash].[name].lazy.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/, 
                use: [
                    {loader: MiniCssExtractPlugin.loader},
                    {loader: "css-loader"}
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin()
    ]    
});