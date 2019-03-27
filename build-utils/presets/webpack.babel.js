module.exports = (env) => ({
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ["babel-loader"]
            }
        ]
    }
})