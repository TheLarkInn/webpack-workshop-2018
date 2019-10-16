const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = () => ({
    output: {
        filename: "bundle.prod.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin()
    ]
})