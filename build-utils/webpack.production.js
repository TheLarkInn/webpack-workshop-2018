const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = () => ({
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