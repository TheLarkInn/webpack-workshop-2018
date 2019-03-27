const CompressionWebpackPlugin = require("compression-webpack-plugin");

module.exports = (env) => ({
    plugins: [
        new CompressionWebpackPlugin()
    ]
})