module.exports = (env) => ({
    module: {
        rules: [
            {
                test: /\.css$/, 
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            }
        ]
    }
});